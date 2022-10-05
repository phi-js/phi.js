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
  <div class="MediaVideoSettings UiForm">
    <fieldset>
      <legend>Video URL</legend>
      <UiInput
        v-model="block.props.url"
        type="url"
        :endpoint="$attrs.endpoint"
        @update:model-value="emitInput"
      />
    </fieldset>

    <fieldset>
      <legend>Settings</legend>
      <UiInput
        v-model="block.props.controls"
        type="checkbox"
        placeholder="Show controls"
        @update:model-value="emitInput"
      />
      <UiInput
        v-model="block.props.autoplay"
        type="checkbox"
        placeholder="Auto-play"
        @update:model-value="emitInput"
      />
      <UiInput
        v-model="block.props.mute"
        type="checkbox"
        placeholder="Mute audio"
        @update:model-value="emitInput"
      />
    </fieldset>

    <fieldset>
      <legend>Variables</legend>
      <UiInput
        v-model="block['v-model:isPlaying']"
        type="text"
        placeholder="Variable name"
        label="isPlaying"
        @update:model-value="emitInput"
      />
      <UiInput
        v-model="block['v-model:currentTime']"
        type="text"
        placeholder="Variable name"
        label="currentTime"
        @update:model-value="emitInput"
      />
      <UiInput
        v-model="block['v-model:activeChapters']"
        type="text"
        placeholder="Variable name"
        label="activeChapters"
        @update:model-value="emitInput"
      />
    </fieldset>
  </div>
</template>