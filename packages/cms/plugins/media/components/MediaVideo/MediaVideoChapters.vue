<script setup>
import { ref, watch } from 'vue'
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

watch(
  () => props.modelValue,
  (newValue) => {
    block.value = {
      props: { chapters: null },
      ...newValue,
    }
  },
  { immediate: true },
)

function emitInput() {
  emit('update:modelValue', { ...block.value })
}
</script>

<template>
  <UiVideoChaptersEditor
    v-model="block.props.chapters"
    class="MediaVideoChapters"
    :url="block.props.url"
    @update:model-value="emitInput"
  />
</template>