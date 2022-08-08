<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  Page object (i.e. CmsBlock component=LayoutPage)
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:model-value'])

const page = ref()
const isHashDirty = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    page.value = { ...newValue }
    isHashDirty.value = !!page.value.id
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:model-value', { ...page.value })
}

function onTitleChange() {
  if (!isHashDirty.value) {
    page.value.hash = toValidHash(page.value.title)
  }
}

function toValidHash(string) {
  if (!string) {
    return ''
  }

  return string
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 16)
}
</script>

<template>
  <div class="LayoutPageSettings">
    <UiInput
      v-model="page.title"
      type="text"
      label="Title"
      @update:model-value="onTitleChange(); emitUpdate();"
    />
    <UiInput
      v-model="page.hash"
      type="text"
      label="Hash"
      @update:model-value="isHashDirty = true; emitUpdate();"
    />
  </div>
</template>