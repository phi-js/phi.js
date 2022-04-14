<script>
import { h, ref, shallowRef, watchEffect, Transition, inject } from 'vue'
import { VM } from '@/packages/vm'
import { parse } from '@/packages/vm/lib/utils'

import { getProperty, setProperty, getBlockRules, runValidators, getCssObjectAttributes } from '../../functions'
import CMS from '../../singleton/'

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
  },

  emits: ['update:modelValue', 'update:errors'],

  setup(props, { emit, attrs }) {
    /* Internal Block VM object */
    const blockVM = new VM()
    blockVM.onModelSet = (varname, newValue) => {
      setProperty(props.modelValue, varname, newValue)
      emitUpdate()
    }

    const injectedStory = inject('$_cms_story', null)
    if (injectedStory) {
      blockVM.custom = { story: injectedStory }
    }

    /* Handle modelValue updates */
    function emitUpdate() {
      emit('update:modelValue', props.modelValue)
    }

    /* Block definition */
    const blockComponent = shallowRef()
    CMS.getDefinition(props.block).then((def) => blockComponent.value = def?.block?.component)

    /* Block visibility (v-if) */
    const isVisible = ref(true)
    watchEffect(async () => {
      if (props.block?.['v-if'] !== undefined) {
        isVisible.value = await blockVM.eval(props.block['v-if'], { ...props.modelValue, ...injectedStory?.globals })
      }
    })

    /* Eval'd block props */
    const blockProps = ref()
    watchEffect(() => {
      // Parsed block props
      blockProps.value = typeof props.block.props === 'object'
        ? parse(props.block.props, { ...props.modelValue, ...injectedStory?.globals })
        : {}

      // props from v-models
      for (const p in props.block) {
        if (p.substring(0, 7) === 'v-model' && props.block[p]) {
          const variableName = props.block[p]
          const propName = p.substring(8) || 'modelValue'
          blockProps.value[propName] = getProperty(props.modelValue, variableName)
        }
      }
    })

    /* style and class properties */
    const cssProps = ref({
      style: null,
      class: null,
    })

    watchEffect(() => {
      if (typeof props.block?.css !== 'object') {
        return
      }
      const evaldCSS = parse(props.block.css, { ...props.modelValue, ...injectedStory?.globals })
      cssProps.value = getCssObjectAttributes(evaldCSS)
    })


    /* Validation management */
    const errors = ref([])
    const childErrors = {} // childErrors[slot:index]  e.g.  childErrors[default:0] = [....]

    function setErrors(arrErrors) {
      errors.value = Array.isArray(arrErrors) ? arrErrors : []
      emitErrors()
    }

    function emitErrors() {
      const allChildErrors = []
      Object.values(childErrors).forEach((errs) => allChildErrors.push(...errs))
      emit('update:errors', [...errors.value, ...allChildErrors])
    }


    /* Block event listeners */
    const blockListeners = ref({})

    // v-models listeners
    for (const p in props.block) {
      if (p.substring(0, 7) === 'v-model' && props.block[p]) {
        const variableName = props.block[p]
        const propName = p.substring(8) || 'modelValue'
        const eventName = 'onUpdate:' + propName

        const callback = (newValue) => {
          setProperty(props.modelValue, variableName, newValue) // MUTATING PROP modelValue (!!!)
          emitUpdate()
        }

        blockListeners.value[eventName] = blockListeners.value[eventName]
          ? [blockListeners.value[eventName], callback]
          : callback
      }
    }

    // v-on listeners
    if (props.block?.['v-on']) {
      const listeners = props.block['v-on']
      for (let eventName in listeners) {
        const eventCallback = ($event) => blockVM.eval(
          listeners[eventName],
          { ...props.modelValue, ...injectedStory?.globals, $event },
        )

        const propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
        blockListeners.value[propName] = blockListeners.value[propName]
          ? [blockListeners.value[propName], eventCallback]
          : eventCallback
      }
    }

    // Validation listeners
    if (props.block?.rules?.length) {
      const blockRules = getBlockRules(props.block, props.modelValue, blockVM)
      const eventRules = {} // e.g. eventRules[onBlur] = [ array of rules to validate on blur ]
      blockRules.forEach((rule) => {
        if (!rule.trigger?.length) {
          return
        }
        rule.trigger.forEach((eventName) => {
          let listenerName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
          if (!eventRules[listenerName]) {
            eventRules[listenerName] = []
          }
          eventRules[listenerName].push(rule)
        })
      })

      // Bind validation to component events
      for (const [listenerName, targetRules] of Object.entries(eventRules)) {
        const eventCallback = async () => {
          const errs = await runValidators(targetRules)
          setErrors(errs)
        }

        blockListeners.value[listenerName] = blockListeners.value[listenerName]
          ? [blockListeners.value[listenerName], eventCallback]
          : eventCallback
      }
    }


    /* Determine slot nodes */
    const blockSlots = ref({})

    const slots = { ...props.block.slots }
    if (props.block.slot) {
      slots.default = props.block.slot
    }

    for (const slotName in slots) {
      const arrChildren = Array.isArray(slots[slotName]) ? slots[slotName] : [slots[slotName]]
      blockSlots.value[slotName] = () => arrChildren.map((child, index) => h(
        CmsBlock,
        {
          'block': child,
          'modelValue': props.modelValue,
          'onUpdate:modelValue': () => emitUpdate(),
          'onUpdate:errors': ($event) => {
            childErrors[slotName + ':' + index] = $event
            emitErrors()
          },
        },
      ))
    }

    return {
      attrs,
      errors,
      isVisible,
      blockComponent,
      blockProps,
      blockListeners,
      blockSlots,
      cssProps,
      emitUpdate,
    }
  },

  render() {
    if (!this.blockComponent) {
      return
    }

    // Get iterations (v-for)
    const iterable = this.block?.['v-for'] ? getProperty(this.modelValue, this.block['v-for']) : null
    if (Array.isArray(iterable)) {
      return iterable.map(($item, $index) => h(
        CmsBlock,
        {
          'key': $index,
          'block': {
            ...this.block,
            'v-for': undefined,
          },
          'modelValue': {
            ...this.modelValue,
            $item,
            $index,
          },
          'onUpdate:modelValue': () => this.emitUpdate(),
          'class': 'CmsBlock--iteration CmsBlock--iteration-' + $index,
        },
      ))
    }

    const blockNode = h(
      this.blockComponent,
      {
        ...this.attrs,
        ...this.blockProps,
        ...this.blockListeners,
        style: [this.blockProps.style, this.cssProps.style],
        class: [this.blockProps.class, this.cssProps.class],
        errors: this.errors,
      },
      this.blockSlots,
    )

    // v-if transition
    if (this.block?.['v-if']) {
      if (this.block.transition) {
        return h(
          Transition,
          { name: 'transition-fade', ...this.block.transition },
          () => this.isVisible ? blockNode : null,
        )
      } else {
        return this.isVisible ? blockNode : null
      }
    }

    return blockNode
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