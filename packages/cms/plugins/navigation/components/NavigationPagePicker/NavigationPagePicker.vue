<script setup>
import { inject, computed } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  pageId: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:pageId'])

const injectedStory = inject('_cms_currentStory', null)
const availablePages = computed(() => injectedStory?.value?.pages || [])
</script>

<template>
  <UiInput
    type="select-list"
    :options="availablePages"
    :model-value="props.pageId"
    option-text="$.info.text"
    option-value="$.id"
    @update:model-value="emit('update:pageId', $event)"
  />
</template>