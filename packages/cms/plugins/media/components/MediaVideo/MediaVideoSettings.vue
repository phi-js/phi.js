<script setup>
import { ref, watchEffect } from 'vue'
import { UiTabs, UiTab, UiInput } from '@/packages/ui'
import UiVideoChaptersEditor from '@/packages/ui/components/UiVideo/UiVideoChaptersEditor.vue'

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
watchEffect(() => block.value = Object.assign({
  'component': 'MediaVideo',
  'props': {
    url: '',
    chapters: null,
  },
  'v-model:isPlaying': '',
  'v-model:currentTime': '',
}, props.modelValue))

function emitInput() {
  emit('update:modelValue', { ...block.value })
}

</script>

<template>
  <div class="MediaVideoSettings">
    <UiTabs>
      <UiTab text="Settings">
        <div class="UiForm">
          <fieldset>
            <legend>URL</legend>
            <UiInput
              v-model="block.props.url"
              type="url"
              :endpoint="$attrs.endpoint"
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
      </UiTab>

      <UiTab text="Chapters">
        <UiVideoChaptersEditor
          v-model="block.props.chapters"
          :url="block.props.url"
          @update:model-value="emitInput"
        />
      </UiTab>
    </UiTabs>
  </div>
</template>