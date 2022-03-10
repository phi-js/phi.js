<script setup>
import { inject, computed } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  fn call statement
  {
    call: "Story.goTo" || "Story.goBack"
    args": ""  // pageId
  }
  */
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const injectedStoryData = inject('$_cms_story_editor', null)

const availablePages = computed(() => {
  return injectedStoryData?.story?.value?.pages || []
})

function emitPageId(pageId) {
  emit('update:modelValue', { ...props.modelValue, args: pageId })
}
</script>

<template>
  <UiInput
    type="select-list"
    :options="availablePages"
    :modelValue="props.modelValue?.args"
    @update:modelValue="emitPageId($event)"
    option-text="$.info.text"
    option-value="$.id"
  />
</template>