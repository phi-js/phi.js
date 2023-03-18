<script setup>
import { UiTabs, UiTab } from '@/packages/ui'
import { useI18n } from '@/packages/i18n'
import OpenAiText from './OpenAiText.vue'
import OpenAiCss from './OpenAiCss.vue'
import OpenAiImage from './OpenAiImage.vue'
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
  <div class="OpenAiBlockHelper">
    <UiTabs>
      <UiTab
        v-if="modelValue.component == 'MediaHtml'"
        text="Content"
      >
        <OpenAiText
          :existing="existingText"
          @input="onTextInput"
        />
      </UiTab>

      <UiTab
        v-if="modelValue.component == 'MediaImage'"
        text="Image"
      >
        <OpenAiImage @input="emitUpdate({props:{src:$event}})" />
      </UiTab>

      <UiTab text="Style">
        <OpenAiCss
          :existing="props.modelValue.props?.style"
          @input="emitUpdate({props:{style:$event}})"
        />
      </UiTab>
    </UiTabs>
  </div>
</template>