<script>
import { h, ref, shallowRef, watchEffect, Transition, inject, computed, watch } from 'vue'
import { VM } from '@/packages/vm'
import { getBlockDefinition } from '../../functions'

import {
  getPluginData,
  useStorySettings,
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

    const injectedStory = inject('$_cms_story', null)
    if (injectedStory) {
      blockVM.custom = { story: injectedStory }
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
      return getProperty(props.modelValue, propName)
    }

    function setModelProperty(propName, newValue) {
      setProperty(innerModel, propName, newValue)
      emitUpdate({ ...innerModel })
    }

    function emitUpdate(newModelValue) {
      _haltEmit = true
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
    const storySettings = useStorySettings()

    watchEffect(() => {
      const allProps = {
        ...blockDefinition?.block?.props,
        ...props.block?.props,
      }

      // Parsed block props
      blockProps.value = blockVM.eval(
        allProps,
        {
          ...evaluableModel.value,
          $settings: storySettings,
        },
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

    /* Block event listeners */
    const blockListeners = ref({})

    function pushListener(eventName, callback) {
      if (!blockListeners.value[eventName]) {
        blockListeners.value[eventName] = callback
        return
      }
      if (Array.isArray(blockListeners.value[eventName])) {
        blockListeners.value[eventName].push(callback)
        return
      }

      blockListeners.value[eventName] = [blockListeners.value[eventName], callback]
    }


    // v-models listeners
    const tmpInnerModel = {}

    for (const p in props.block) {
      if (p.substring(0, 7) === 'v-model' && props.block[p]) {
        const variableName = props.block[p]
        const propName = p.substring(8) || 'modelValue'
        const eventName = 'onUpdate:' + propName

        const callback = (newValue) => {
          setModelProperty(variableName, newValue)
          setProperty(tmpInnerModel, variableName, newValue)
        }

        pushListener(eventName, callback)
      }
    }

    // v-on listeners
    /*
    Edge case:   block['v-on']['update:modelValue']
    Se espera que en el modelo a evaluar venga el valor actualizado del v-model.
    Para esto se usa tmpInnerModel, cuyo valor se establece cuando ha ocurrido el onUpdate:modelValue creado por la propiedad v-model
    */
    if (props.block?.['v-on']) {
      const listeners = props.block['v-on']
      for (let eventName in listeners) {
        const eventCallback = ($event) => {
          blockVM.eval(
            listeners[eventName],
            {
              // ...evaluableModel.value,  // evaluableModel is not reacting to outer chages of innerModel., so use innerModel directly instead
              ...innerModel,
              ...tmpInnerModel,
              $event,
              $block: props.block,
            },
          )
        }

        const propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
        pushListener(propName, eventCallback)
      }
    }


    /*
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
    if (Array.isArray(props.block.bubble)) {
      props.block.bubble.forEach((eventName) => {
        const propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
        pushListener(propName, ($event) => injectedStory?.emitStoryEvent?.({
          name: eventName,
          data: $event,
          block: props.block,
          bubbled: true,
        }))
      })
    }


    /*
    Block listeners defined via plugins
    */
    const pluginData = getPluginData()
    if (Array.isArray(pluginData?.blockListeners)) {
      pluginData.blockListeners.forEach((listener) => {
        const propName = 'on' + listener.event.charAt(0).toUpperCase() + listener.event.slice(1)
        pushListener(
          propName,
          ($event) => {
            return listener.callback($event, props.block, innerModel)
          },
        )
      })
    }

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
            .map((child) => h(
              CmsBlock,
              {
                'block': child,
                'modelValue': props.modelValue,
                'slotBindings': slotBindings,
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
                'key': $index,
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

      getModelProperty,
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
        class: [this.attrs?.class, 'CmsBlock', this.blockDefinition.name, this.blockProps.class],
      },
      this.blockSlots,
    )

    // v-if transition
    if (this.block.transition) {
      return h(
        Transition,
        { name: 'transition-fade', ...this.block.transition },
        () => this.isVisible ? blockNode : null,
      )
    }

    return this.isVisible ? blockNode : null
  },
}
export default CmsBlock
</script>

<style lang="scss">
.transition-fade-enter-active,
.transition-fade-leave-active {
  transition: opacity var(--ui-duration-quick);
}

.transition-fade-enter-from,
.transition-fade-leave-to {
  opacity: 0;
}
</style>