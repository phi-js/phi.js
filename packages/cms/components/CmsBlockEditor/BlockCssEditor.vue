<script setup>
import { UiTabs, UiTab } from '@/packages/ui'
import BlockCssClasses from './BlockCssClasses.vue'
import BlockCssStyle from './BlockCssStyle.vue'

import OpenAiCss from '../../plugins/openai/OpenAiCss.vue'

const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return mergeDeep(target, ...sources)
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}
</script>

<template>
  <UiTabs
    class="BlockCssEditor"
    name="BlockCssEditor"
  >
    <slot name="default" />

    <UiTab text="Classes">
      <BlockCssClasses
        :block="props.modelValue"
        @update:block="emit('update:modelValue', $event)"
      />
    </UiTab>

    <UiTab text="Properties">
      <BlockCssStyle
        :block="props.modelValue"
        @update:block="emit('update:modelValue', $event)"
      />
    </UiTab>

    <UiTab text="OpenAI">
      <OpenAiCss
        :existing="props.modelValue.props?.style"
        @input="emit('update:modelValue', mergeDeep(props.modelValue, {props:{style:$event}}))"
      />
    </UiTab>
  </UiTabs>
</template>