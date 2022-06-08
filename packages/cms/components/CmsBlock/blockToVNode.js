import { h, reactive } from 'vue'
import { parse } from '@/packages/vm/lib/utils'
import { getProperty, setProperty, getCssObjectAttributes, getBlockDefinition } from '../../functions'

/*
block: {
  component: 'MediaHtml',
  props: {
    ....
    something: "Hola! Soy {{aModelVariable}} {{$item.me}} {{$slot.huh}}"
  },
  v-on: {
    click: "VM expression"
  },
  v-model: ...,
  v-model:stuff: ....,
  css: {
    classes,
    style
  },

  slot: []
  slots: {
    default: [],
    another: []
  },

  "rules": [
    {
      "required": true,
      "message": "Por favor escribe tu nombre"
    }
  ]
}

modelValue: a REACTIVE object to be used as global modelValue
*/
export default function blockToVNode(block, modelValue, blockVM, masterValue = null) {
  if (masterValue === null) {
    masterValue = modelValue
  }

  /* Iterate repetitions (v-for) */
  if (block['v-for']) {
    const iterable = getProperty(modelValue, block['v-for'])
    if (Array.isArray(iterable)) {
      return iterable.map(($item, $index) =>
        blockToVNode(
          { ...block, 'v-for': null },
          { ...modelValue, $item, $index },
          blockVM,
          masterValue,
        ))
    }

    return null
  }


  if (!blockVM.onModelSet) {
    blockVM.onModelSet = (variableName, newValue) => {
      if (variableName.includes('.') || variableName.includes('[')) {
        setProperty(modelValue, variableName, newValue)
      } else {
        setProperty(masterValue, variableName, newValue)
      }
    }
  }

  /* Evaluate visibility (v-if) */
  const isVisible = typeof block['v-if'] !== 'undefined'
    ? blockVM.eval(block['v-if'], modelValue)
    : true

  if (!isVisible) {
    return null
  }

  const definition = getBlockDefinition(block)
  if (!definition?.block?.component) {
    return null
  }

  /* Block props */
  const parsedProps = parse(
    { ...definition.block.props, ...block.props },
    modelValue,
    true,
  )

  /* Block v-models */
  for (const p in block) {
    if (p.substring(0, 7) === 'v-model' && block[p]) {
      const variableName = block[p]
      const propName = p.substring(8) || 'modelValue'
      parsedProps[propName] = getProperty(modelValue, variableName)

      const eventName = 'onUpdate:' + propName
      parsedProps[eventName] = ($event) => {
        if (variableName.includes('.') || variableName.includes('[')) {
          setProperty(modelValue, variableName, $event)
        } else {
          setProperty(masterValue, variableName, $event)
        }
      }
    }
  }

  /* Block event listeners (v-on) */
  if (block['v-on']) {
    const listeners = block['v-on']
    for (let eventName in listeners) {
      const eventCallback = ($event) => {
        return blockVM.eval(listeners[eventName], { ...modelValue, $event })
      }

      const propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
      if (parsedProps[propName]) {
        parsedProps[propName] = [parsedProps[propName], eventCallback]
      } else {
        parsedProps[propName] = eventCallback
      }
    }
  }


  /* Block "css" property */
  if (block.css && typeof block.css === 'object') {
    const evaldCSS = parse(block.css, modelValue)
    const cssProps = getCssObjectAttributes(evaldCSS, block)

    if (cssProps.class) {
      parsedProps.class = parsedProps.class ? [parsedProps.class, cssProps.class] : cssProps.class
    }

    if (cssProps.style) {
      parsedProps.style = parsedProps.style ? [parsedProps.style, cssProps.style] : cssProps.style
    }
  }


  /* Block slots */
  const blockSlots = { ...block.slots }
  if (block.slot) {
    blockSlots.default = block.slot
  }

  const nodeSlots = {}
  for (const slotName in blockSlots) {
    const arrChildren = Array.isArray(blockSlots[slotName])
      ? blockSlots[slotName]
      : (blockSlots[slotName] ? [blockSlots[slotName]] : [])

    nodeSlots[slotName] = (slotBindings) => {
      return arrChildren.map((child) => blockToVNode(
        child,
        { ...modelValue, $slot: slotBindings },
        blockVM,
        masterValue,
      ))
    }
  }

  /* Validation handlers */
  if (block.rules) {
    parsedProps.errors = reactive(['boooo'])
  }

  /* Create VNode */
  return h(
    definition.block.component,
    parsedProps,
    nodeSlots,
  )
}