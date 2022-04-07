<script>
import { h, ref, shallowRef, watchEffect, Transition, Teleport, inject } from 'vue'
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
    const blockDefinition = shallowRef()
    const blockVM = new VM()

    const blockNode = shallowRef()
    const styleNode = shallowRef()

    const isVisible = ref(true)
    const errors = ref([])

    function emitUpdate(val) {
      emit('update:modelValue', val)
    }

    // Provide Story in custom VM data (e.g. used in plugins\navigation\functions\story\index.js)
    const injectedStory = inject('$_cms_story', null)
    if (injectedStory) {
      blockVM.custom = { story: injectedStory }
    }

    watchEffect(async () => blockDefinition.value = await CMS.getDefinition(props.block))

    watchEffect(async () => {
      const blockComponent = blockDefinition?.value?.block?.component
      if (!blockComponent) {
        return
      }

      // Check visibility (v-if)
      if (props.block?.['v-if'] !== undefined) {
        isVisible.value = await blockVM.eval(props.block['v-if'], { ...props.modelValue, ...injectedStory?.globals })
        if (!isVisible.value) {
          return
        }
      }

      // Parse block props
      const blockProps = typeof props.block.props === 'object'
        ? parse(props.block.props, { ...props.modelValue, ...injectedStory?.globals })
        // ? await blockVM.eval(props.block.props, props.modelValue)  // this breaks updates when modelvalue changes outside
        : {}

      // v-models
      for (const p in props.block) {
        if (p.substring(0, 7) === 'v-model' && props.block[p]) {
          const variableName = props.block[p]
          const propName = p.substring(8) || 'modelValue'
          const eventName = 'onUpdate:' + propName

          blockProps[propName] = getProperty(props.modelValue, variableName)
          const callback = (newValue) => {
            setProperty(props.modelValue, variableName, newValue)
            emitUpdate(props.modelValue)
          }

          blockProps[eventName] = blockProps[eventName] ? [blockProps[eventName], callback] : callback
        }
      }

      // v-on
      if (props.block?.['v-on']) {
        const listeners = props.block['v-on']
        for (let eventName in listeners) {
          const eventCallback = ($event) => {
            const initial = blockVM.onModelSet
            blockVM.onModelSet = (varname, newValue) => {
              setProperty(props.modelValue, varname, newValue)
              emitUpdate(props.modelValue)
            }

            blockVM.eval(listeners[eventName], { ...props.modelValue, ...injectedStory?.globals, $event })
              .then(() => blockVM.onModelSet = initial)
          }

          const propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
          blockProps[propName] = blockProps[propName]
            ? [blockProps[propName], eventCallback]
            : eventCallback
        }
      }

      // Validation rule events
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

        for (const [listenerName, targetRules] of Object.entries(eventRules)) {
          const eventCallback = async () => {
            errors.value = await runValidators(targetRules)
            emit('update:errors', errors.value)
          }

          blockProps[listenerName] = blockProps[listenerName]
            ? [blockProps[listenerName], eventCallback]
            : eventCallback
        }
      }

      // Parse slots
      const slots = { ...props.block.slots }
      if (props.block.slot) {
        slots.default = props.block.slot
      }
      const blockSlots = {}

      const childErrors = {} // childErrors[slot_index]  e.g.  childErrors[default_0] = [....]

      for (const slotName in slots) {
        const arrChildren = Array.isArray(slots[slotName]) ? slots[slotName] : [slots[slotName]]
        blockSlots[slotName] = () => arrChildren.map((child, index) => h(CmsBlock, {
          'block': child,
          'modelValue': props.modelValue,
          'onUpdate:modelValue': ($event) => {
            emitUpdate($event)
          },
          'onUpdate:errors': ($event) => {
            childErrors[slotName + '_' + index] = $event

            const allChildErrors = []
            Object.values(childErrors).forEach((errs) => allChildErrors.push(...errs))
            emit('update:errors', [...errors.value, ...allChildErrors])
          },
        }))
      }

      // Parse block CSS property
      if (typeof props.block?.css === 'object') {
        // const evaldCSS = await blockVM.eval(props.block.css, props.modelValue)
        const evaldCSS = parse(props.block.css, props.modelValue)
        if (evaldCSS.css) {
          styleNode.value = h('style', { type: 'text/css', class: 'CmsBlock__style' }, evaldCSS.css)
        }

        const cssProps = getCssObjectAttributes(evaldCSS)
        if (cssProps.class) {
          blockProps.class = blockProps?.class ? [blockProps.class, ...cssProps.class] : cssProps.class
        }
        if (cssProps.style) {
          blockProps.style = blockProps?.style ? cssProps.style + blockProps.style : cssProps.style
        }
      }

      blockProps.class = ['CmsBlock', blockProps.class]
      blockProps.errors = errors.value

      blockNode.value = h(
        blockComponent,
        {
          ...attrs,
          ...blockProps,
        },
        blockSlots,
      )
    })


    // Run ALL validators when modelValue changes
    watchEffect(() => {
      const blockRules = getBlockRules(props.block, props.modelValue, blockVM)
      runValidators(blockRules)
        .then((errs) => {
          errors.value = errs
          emit('update:errors', errors.value)
        })
    })

    return { isVisible, blockNode, styleNode, attrs, props }
  },

  render() {
    if (!this.blockNode) {
      return
    }

    // Get iterations (v-for)
    const iterable = this.block?.['v-for'] ? getProperty(this.modelValue, this.block['v-for']) : null
    if (iterable?.length) {
      return iterable.map(($item, $key) => h(CmsBlock, {
        block: {
          ...this.block,
          'v-for': undefined,
        },
        modelValue: {
          ...this.modelValue,
          $item,
          $key,
        },
        class: 'CmsBlock--iteration CmsBlock--iteration-' + $key,
      }))
    }

    const styleNode = this.styleNode ? h(Teleport, { to: 'head' }, this.styleNode) : null

    // v-if transition
    if (this.block?.['v-if']) {

      if (this.block.transition) {
        const transitionNode = h(
          Transition,
          { name: 'transition-fade', ...this.block.transition },
          () => this.isVisible ? this.blockNode : null,
        )
        return [transitionNode, styleNode]
      } else {
        return this.isVisible ? [this.blockNode, styleNode] : null
      }
    }

    return styleNode
      ? [this.blockNode, styleNode]
      : this.blockNode
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