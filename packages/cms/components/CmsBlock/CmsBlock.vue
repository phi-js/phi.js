<script>
export default defineComponent({
  render() {
    return h('div', { class: 'CmsBlock' }, this.parsedBlocks)
  }
})
</script>

<script setup>
import { h, ref, watch, defineAsyncComponent, Transition, inject, defineComponent } from 'vue'

import { blocks } from '../../singleton'
import { VM } from '@/packages/vm'
import { getProperty, setProperty, getCssObjectAttributes } from '../../functions'

const props = defineProps({
  block: {
    type: [Object, Array],
    required: false,
    default: null,
  },

  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const blockVM = new VM()
const parsedBlocks = ref([])

// provided story methods
const injectedStory = inject('$_cms_story', null)
if (injectedStory) {
  blockVM.defineFunctions({
    'Story.goTo': injectedStory.goTo,
    'Story.goBack': injectedStory.goBack,
  })
}

watch(
  props,
  async () => parsedBlocks.value = await getBlockVNode(props.block, props.modelValue, blockVM),
  { immediate: true },
)


defineExpose({
  parsedBlocks
})

async function getBlockVNode(block, modelValue, vm) {
  // Block v-for
  if (typeof block['v-for'] !== 'undefined') {
    const iterable = getProperty(modelValue, block['v-for'])
    if (!Array.isArray(iterable)) {
      return undefined
    }

    const promises = []
    for (let $index = 0; $index < iterable.length; $index++) {
      const $item = iterable[$index]
      const iterableModelValue = {
        ...modelValue,
        $item,
        $index,
      }

      promises.push(getBlockPropsAndSlots(block, iterableModelValue, vm))
    }

    return (await Promise.all(promises))
      .map((someObj) => {
        return h(getBlockComponent(block.component), someObj.blockProps, someObj.blockSlots)
      })
  }

  const BandP = await getBlockPropsAndSlots(block, modelValue, vm)
  const blockProps = {
    ...BandP.blockProps,
    onMounted: block.setup ? () => vm.eval(block.setup, modelValue) : undefined,
  }

  // Block v-if
  if (typeof block['v-if'] !== 'undefined' && block['v-if'] !== null) {
    const isVisible = await vm.eval(block['v-if'], modelValue)

    if (block.transition) {
      return h(
        Transition,
        { name: 'transition-myfade', ...block.transition },
        () => isVisible
          ? h(getBlockComponent(block.component), blockProps, BandP.blockSlots)
          : null,
      )
    } else if (!isVisible) {
      return undefined
    }
  }

  return h(getBlockComponent(block.component), blockProps, BandP.blockSlots)
}


const foundComponents = {}
function getBlockComponent(componentName) {
  if (!foundComponents?.[componentName]) {
    const definition = blocks[componentName]
    const found = typeof definition.block.component === 'function'
      ? defineAsyncComponent(definition.block.component)
      : definition.block.component

    foundComponents[componentName] = found
  }

  return foundComponents[componentName]
}

async function getBlockPropsAndSlots(block, modelValue, vm) {
  const slots = {}
  const blockSlots = { ...block.slots }
  if (block.slot) {
    blockSlots.default = block.slot
  }

  for (const slotName in blockSlots) {
    const slotPromises = []
    const arrSlot = Array.isArray(blockSlots[slotName]) ? blockSlots[slotName] : [blockSlots[slotName]]
    for (const child of arrSlot) {
      slotPromises.push(getBlockVNode(child, modelValue, vm))
    }
    const childBlocks = await Promise.all(slotPromises)
    slots[slotName] = () => childBlocks
  }

  const definition = blocks[block.component]
  const defaultProps = definition?.block?.props || {}
  const blockProps = (await vm.eval({ ...defaultProps, ...block?.props }, modelValue))

  // Block v-model
  if (typeof block['v-model'] !== 'undefined') {
    blockProps.modelValue = getProperty(modelValue, block['v-model'])
    blockProps['onUpdate:modelValue'] = (newValue) => {
      setProperty(modelValue, block['v-model'], newValue)
      emit('update:modelValue', modelValue)
    }
  }

  // Additional v-models (v-model:modelName=targetName)
  for (const propName in block) {
    if (propName.substring(0, 8) === 'v-model:' && block[propName]) {
      const targetName = block[propName]
      const modelName = propName.substring(8)
      blockProps[modelName] = getProperty(modelValue, targetName)
      blockProps['onUpdate:' + modelName] = (newValue) => {
        setProperty(modelValue, targetName, newValue)
        emit('update:modelValue', modelValue)
      }
    }
  }

  // v-on
  if (typeof block['v-on'] !== 'undefined') {
    let listeners = block['v-on']
    for (let eventName in listeners) {
      let propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)

      const existingTrigger = blockProps[propName]

      blockProps[propName] = ($event) => {
        if (existingTrigger) {
          existingTrigger($event)
        }

        const initial = vm.onModelSet
        vm.onModelSet = (varname, newValue) => {
          setProperty(modelValue, varname, newValue)
          emit('update:modelValue', modelValue)
        }
        vm.eval(listeners[eventName], { ...modelValue, $event }).then(() => vm.onModelSet = initial)
      }
    }
  }

  // block "css" propery.
  // Eval only css.style. classes and css are eval'd on applyStoryCss
  if (block?.css && typeof block.css === 'object') {
    const evaldStyle = block.css.style ? await vm.eval(block.css.style, modelValue) : null
    const cssProps = getCssObjectAttributes({ ...block.css, style: evaldStyle })

    if (cssProps.class) {
      blockProps.class = blockProps?.class ? [blockProps.class, ...cssProps.class] : cssProps.class
    }

    if (cssProps.style) {
      blockProps.style = blockProps?.style ? cssProps.style + blockProps.style : cssProps.style
    }
  }

  return {
    blockProps,
    blockSlots: slots,
  }
}
</script>

<style lang="scss">
.transition-myfade-enter-active,
.transition-myfade-leave-active {
  // transition: opacity 0.5s ease;
  transition: opacity var(--ui-duration-quick);
}

.transition-myfade-enter-from,
.transition-myfade-leave-to {
  opacity: 0;
}
</style>