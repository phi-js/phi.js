<script>
import { h, ref, watch, defineAsyncComponent } from 'vue'

import { blocks } from '../../singleton'
import { VM } from '/packages/vm'
import { getProperty, setProperty } from '../../functions'

export default {
  props: {
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
  },

  setup(props) {
    const blockVM = new VM()
    const parsedBlocks = ref([])

    watch(
      props,
      async () => parsedBlocks.value = await getBlockVNode(props.block, props.modelValue, blockVM),
      { immediate: true },
    )

    // Render function
    return () => h('div', { class: 'CmsBlock' }, parsedBlocks.value)
  },
}

async function getBlockVNode(block, modelValue, vm) {
  // Exclude blocks with non-passing v-if
  if (typeof block['v-if'] !== 'undefined' && !(await vm.eval(block['v-if'], modelValue))) {
    return undefined
  }

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
    }
  }

  // Additional v-models (v-model:modelName=targetName)
  for (const propName in block) {
    if (propName.substr(0, 8) === 'v-model:' && block[propName]) {
      const targetName = block[propName]
      const modelName = propName.substr(8)
      blockProps[modelName] = getProperty(modelValue, targetName)
      blockProps['onUpdate:' + modelName] = (newValue) => {
        setProperty(modelValue, targetName, newValue)
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
          const fooObj = getProperty(modelValue, varname)
          Object.assign(fooObj, newValue)
        }

        vm.eval(listeners[eventName], { ...modelValue, $event })
          .then(() => vm.onModelSet = initial)
      }
    }
  }

  return {
    blockProps,
    blockSlots: slots,
  }
}
</script>