<script setup>
import { ref, watchEffect } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /**
   * BLOCK object
   * {
   *   "component": "MediaVIdeo",
   *   "props": {
   *     "url": "..."
   *   },
   *   "v-model:isPlaying": "someVar",
   *   "v-model:currentTime": "someVar",
   * }
   */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const block = ref({})
watchEffect(() => {
  block.value = {
    'component': 'MediaVideo',
    'v-model:isPlaying': '',
    'v-model:currentTime': '',
    ...props.modelValue,

    'props': {
      url: '',
      chapters: null,
      controls: true,
      autoplay: false,
      mute: false,
      ...props.modelValue?.props,
    },
  }
})

function emitInput() {
  emit('update:modelValue', { ...block.value })
}
</script>

<template>
  <div class="MediaVideoSettings UiForm UiForm--wide">
    <UiInput
      v-model="block.props.url"
      type="url"
      label="URL"
      :endpoint="$attrs.endpoint"
      @update:model-value="emitInput"
    />
    <UiInput
      v-model="block.props.controls"
      type="checkbox"
      label="Show controls"
      @update:model-value="emitInput"
    />
    <UiInput
      v-model="block.props.autoplay"
      type="checkbox"
      label="Auto-play"
      @update:model-value="emitInput"
    />
    <UiInput
      v-model="block.props.mute"
      type="checkbox"
      label="Mute audio"
      @update:model-value="emitInput"
    />
  </div>
</template>