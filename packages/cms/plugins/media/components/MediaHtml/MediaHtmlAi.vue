<script setup>
import { useI18n } from '@/packages/i18n'
import OpenAiText from '../../../openai/OpenAiText.vue'
import { computed } from 'vue'

const i18n = useI18n()

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

function emitUpdate(patch) {
  emit('update:modelValue', mergeDeep(props.modelValue, patch))
}

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

const existingText = computed(() => props.modelValue.props?.value ? i18n.obj(props.modelValue.props?.value) : '')

function onTextInput($event) {
  if (existingText.value) {
    emitUpdate({ props: { value: existingText.value + '\n\n' + $event } })
  } else {
    emitUpdate({ props: { value: $event } })
  }
}
</script>

<template>
  <div class="MediaHtmlAi">
    <OpenAiText
      :existing="existingText"
      @input="onTextInput"
    />
  </div>
</template>