<!-- eslint-disable max-len -->
<script>
import { h, ref, shallowRef, watchEffect, inject, computed, watch, onMounted } from 'vue'
import { VM } from '@/packages/vm'
import { getBlockDefinition } from '../../functions'

import {
  getPluginData,
  getProperty,
  setProperty,
} from '../../functions'

const CmsBlock = {
  inheritAttrs: false,

  props: {
    block: {
      type: Object,
      required: true,
    },

    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    slotBindings: {
      type: Object,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit, attrs }) {
    /* Internal Block VM object */
    const blockVM = new VM()
    blockVM.onModelSet = (varname, newValue) => setModelProperty(varname, newValue)

    const $nav = inject('$_cms_navigation', null)
    const injectedStory = inject('$_cms_story', null)

    blockVM.custom = {
      story: injectedStory,
      $nav,
    }

    /* modelValue source of truth functions */
    const innerModel = props.modelValue
    const evaluableModel = computed(() => ({ ...innerModel, $slot: props.slotBindings }))

    let _haltEmit = false

    watch(
      () => props.modelValue,
      (newValue) => {
        if (_haltEmit) {
          _haltEmit = false
          return
        }
        Object.assign(innerModel, newValue)
      },
    )

    function getModelProperty(propName) {
      // return getProperty(innerModel, propName)

      // Use props.modelValue instead of innerModel, as innerModel is NOT reactive
      // and any call to getModelProperty will not be tracked by watchEffect
      // return getProperty(props.modelValue, propName)
      return getProperty({ ...props.modelValue, $slot: props.slotBindings }, propName)
    }

    function setModelProperty(propName, newValue) {
      if (propName.startsWith('$slot')) {
        // Mutate $slot variables, when block has v-model like "$slot.person.something"
        setProperty({ $slot: props.slotBindings }, propName, newValue)
        return
      }

      setProperty(innerModel, propName, newValue)
      emitUpdate({ ...innerModel })
    }

    function emitUpdate(newModelValue) {
      // _haltEmit = true  // this is breaking updates on computed items (see CmsStory '$enum')
      // The thing is, I know it was added to prevent an update loop, but I've seen no errors after removing it so far
      emit('update:modelValue', newModelValue)
    }

    /* Block definition */
    const blockDefinition = getBlockDefinition(props.block)
    const blockComponent = shallowRef(blockDefinition?.block?.component)
    const blockProps = ref()

    /* Block visibility (v-if) */
    const isVisible = ref(false)
    if (props.block['v-if']) {
      watchEffect(() => isVisible.value = blockVM.eval(props.block['v-if'], evaluableModel.value))
    } else {
      isVisible.value = true
    }

    /* Eval'd block props */

    // only for non-repeating blocks
    if (!props.block['v-for']) {

      watchEffect(() => {
        const allProps = {
          ...blockDefinition?.block?.props,
          ...props.block?.props,
        }

        // Parsed block props
        blockProps.value = blockVM.eval(
          allProps,
          evaluableModel.value,
        )

        // props from v-models
        for (const p in props.block) {
          if (p.substring(0, 7) === 'v-model' && props.block[p]) {
            const variableName = props.block[p]
            const propName = p.substring(8) || 'modelValue'
            blockProps.value[propName] = getModelProperty(variableName)
          }
        }

        // // Set "required" prop if applies
        // if (props.block?.rules?.length && props.block.rules.find((r) => r.required)) {
        //   blockProps.value.required = true
        // }
        if (props.block?.rules?.length) {
          blockProps.value.rules = props.block.rules
        }
      })
    }

    /* Block event listeners */
    function pushListener(objListeners, eventName, callback) {
      if (!objListeners[eventName]) {
        objListeners[eventName] = callback
        return
      }

      if (Array.isArray(objListeners[eventName])) {
        objListeners[eventName].push(callback)
        return
      }

      objListeners[eventName] = [objListeners[eventName], callback]
    }

    const pluginData = getPluginData()

    const blockListeners = computed(() => {
      const retval = {}

      // v-models listeners
      for (const p in props.block) {
        if (p.substring(0, 7) === 'v-model' && props.block[p]) {
          const variableName = props.block[p]
          const propName = p.substring(8) || 'modelValue'
          const eventName = 'onUpdate:' + propName

          const callback = (newValue) => setModelProperty(variableName, newValue)

          pushListener(retval, eventName, callback)
        }
      }

      // v-on listeners
      if (props.block?.['v-on']) {
        const listeners = props.block['v-on']
        for (let eventName in listeners) {
          const eventCallback = ($event) => {
            return blockVM.eval(
              listeners[eventName],
              {
                ...innerModel,
                $event,
                $block: props.block,
              },
            )
          }

          const propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
          pushListener(retval, propName, eventCallback)
        }
      }

      // Block listeners defined via plugins
      if (Array.isArray(pluginData?.blockListeners)) {
        pluginData.blockListeners.forEach((listener) => {
          const propName = 'on' + listener.event.charAt(0).toUpperCase() + listener.event.slice(1)
          pushListener(
            retval,
            propName,
            ($event) => {
              return listener.callback($event, props.block, innerModel)
            },
          )
        })
      }

      // Listeners declared via attrs
      for (const [attrName, attrValue] of Object.entries(attrs)) {
        if (attrName.startsWith('on')) {
          pushListener(retval, attrName, attrValue)
        }
      }

      return retval
    })


    /*
    DEPRECATED
    "bubble" property in block indicates which block events should be bubbled
    i.e. the CmsStory object will EMIT them in a 'story-emit' event: <CmsStory @story-emit="..." />

    i.e.
    block {
      component: 'InputText',
      props: { ... },
      bubble: ['update:modelValue']
    }

    is equivalent to:

    block {
      component: 'InputText',
      props: { ... },
      'v-on': {
        'update:modelValue': {
          call: 'Story.emit',
          args: {
            name: 'update:ModelValue',
            data: '{{$event}}'
          }
        }
      }
    }
    */
    // if (Array.isArray(props.block.bubble)) {
    //   props.block.bubble.forEach((eventName) => {
    //     const propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
    //     pushListener(propName, ($event) => injectedStory?.emitStoryEvent?.({
    //       name: eventName,
    //       data: $event,
    //       block: props.block,
    //       bubbled: true,
    //     }))
    //   })
    // }


    /* Determine slot nodes */
    const blockSlots = ref({})

    function onChildUpdateModelvalue($event) {
      emitUpdate($event)
      if (props.block['v-on']?.['update:modelValue']) {
        blockVM.eval(props.block['v-on']['update:modelValue'], { ...evaluableModel.value, $event })
      }
    }

    watchEffect(() => {
      const slots = { ...props.block.slots }
      if (!slots.default?.length && props.block?.slot?.length) {
        slots.default = props.block.slot
      }

      for (const slotName in slots) {
        const arrChildren = (Array.isArray(slots[slotName]) ? slots[slotName] : [slots[slotName]])
          .filter((child) => !!child)

        if (!arrChildren.length) {
          continue
        }

        blockSlots.value[slotName] = (slotBindings) => {
          return arrChildren
            .map((child, i) => h(
              CmsBlock,
              {
                'key': child._key || i,
                'block': child,
                'modelValue': props.modelValue,
                'slotBindings': { ...props.slotBindings, ...slotBindings },
                'onUpdate:modelValue': ($event) => onChildUpdateModelvalue($event),
              },
            ))
        }
      }
    })


    /* V-FOR iterations */
    const iterable = ref(null)
    const iterations = ref([])
    if (props.block['v-for']) {
      watchEffect(() => {
        iterable.value = getModelProperty(props.block['v-for'])
      })

      watchEffect(() => {
        if (Array.isArray(iterable.value)) {
          iterations.value = iterable.value.map(($item, $index) => {
            return h(
              CmsBlock,
              {
                'key': $item?.id || $index,
                'block': {
                  ...props.block,
                  'v-for': undefined,
                },
                'modelValue': Object.assign({}, innerModel, { $item, $index }),
                'onUpdate:modelValue': ($event) => emitUpdate($event),
                'class': 'CmsBlock--iteration CmsBlock--iteration-' + $index,
              },
            )
          })
        }
      })
    }


    /* Block transition classnames */
    const transitionClassNames = computed(() => {
      let blockTransitions = props.block?.transitions

      if (props.block.component === 'LayoutPage' && !blockTransitions) {
        blockTransitions = injectedStory?.sanitizedStory?.value?.navigation?.defaultTransition?.transitions
      }

      if (!blockTransitions) {
        blockTransitions = {}
      }

      const objTransitions = {
        'navigation-forward-enter': blockTransitions['navigation-forward-enter'] || blockTransitions['navigation-enter'],
        'navigation-forward-leave': blockTransitions['navigation-forward-leave'] || blockTransitions['navigation-leave'],
        'navigation-back-enter': blockTransitions['navigation-back-enter'] || blockTransitions['navigation-enter'],
        'navigation-back-leave': blockTransitions['navigation-back-leave'] || blockTransitions['navigation-leave'],
        'show': blockTransitions.show,
        'hide': blockTransitions.hide,
      }

      const retval = []
      for (const [key, value] of Object.entries(objTransitions)) {
        if (value) {
          retval.push(`_phi_transition_${key}_${value}`)
        }
      }
      return retval
    })


    /* REF to block component */
    const blockRef = ref()
    onMounted(() => {
      if (props.block.ref && blockRef.value) {
        injectedStory.defineBlockRef(props.block.ref, blockRef.value)
      }
    })

    return {
      attrs,
      isVisible,
      blockDefinition,
      blockComponent,
      blockProps,
      blockListeners,
      blockSlots,
      emitUpdate,
      iterable,
      iterations,
      transitionClassNames,

      getModelProperty,
      blockRef,
    }
  },

  render() {
    if (!this.blockComponent) {
      return
    }

    if (this.block?.['v-for']) {
      return this.iterations
    }

    const blockNode = h(
      this.blockComponent,
      {
        ...this.attrs,
        ...this.blockProps,
        ...this.blockListeners,
        class: [
          'CmsBlock',
          this.attrs?.class,
          this.blockDefinition.name,
          this.blockProps.class,
          this.transitionClassNames,
        ],
        ref: this.block.ref ? 'blockRef' : undefined,
      },
      this.blockSlots,
    )

    // // v-if transition
    // if (this.block.transition) {
    //   return h(
    //     Transition,
    //     { name: 'transition-fade', ...this.block.transition },
    //     () => this.isVisible ? blockNode : null,
    //   )
    // }

    return this.isVisible ? blockNode : null
  },
}
export default CmsBlock
</script>