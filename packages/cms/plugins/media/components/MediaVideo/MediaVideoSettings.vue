<script setup>
import { ref, watchEffect } from 'vue'

import { UiInput } from '../../../../../ui'
import UiVideoChaptersEditor from '../../../../../ui/components/UiVideo/UiVideoChaptersEditor.vue'

const props = defineProps({
  /**
   * BLOCK object
   * {
   *   "component": "MediaVIdeo",
   *   "props": { ... },
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
watchEffect(() => block.value = Object.assign({
  'component': 'MediaVideo',
  'props': {},
  'v-model:isPlaying': '',
  'v-model:currentTime': '',
}, props.modelValue))

function emitInput() {
  emit('update:modelValue', { ...block.value })
}

</script>

<template>
  <div class="MediaVideoSettings">
    <div class="UiForm">
      <fieldset>
        <legend>Capítulos</legend>
        <UiVideoChaptersEditor
          v-model="block.props.chapters"
          :url="block.props.url"
          @update:modelValue="emitInput"
        />
      </fieldset>

      <fieldset>
        <legend>Variables</legend>
        <UiInput
          v-model="block['v-model:isPlaying']"
          type="text"
          label="v-model:isPlaying"
          @update:modelValue="emitInput"
        />
        <UiInput
          v-model="block['v-model:currentTime']"
          type="text"
          label="v-model:currentTime"
          @update:modelValue="emitInput"
        />
        <UiInput
          v-model="block['v-model:activeChapters']"
          type="text"
          label="v-model:activeChapters"
          @update:modelValue="emitInput"
        />
      </fieldset>
    </div>
  </div>
</template>