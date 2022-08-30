<script setup>
import { ref, watch } from 'vue'

import { UiUpload, UiInput } from '@/packages/ui'

const props = defineProps({
  // Block "props" object
  modelValue: {
    type: Object, //block.props (files and vue)
    required: false,
    default: null,
  },

  endpoint: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref({})

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = { ...newValue }
    if (!Array.isArray(innerValue.value.files)) {
      innerValue.value.files = []
    }
  },
  { immediate: true },
)

function emitInput() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerValue.value)))
}
</script>

<template>
  <div class="MediaGalleryEditor">
    <UiInput
      v-model="innerValue.view"
      label="Vista"
      type="select-native"
      :options="[
        {value: 'list', text: 'Lista'},
        {value: 'grid', text: 'Cuadrícula'},
        {value: 'gallery', text: 'Galería'},
      ]"
      @update:model-value="emitInput"
    />

    <UiInput
      v-show="innerValue.view == 'gallery'"
      v-model="innerValue.previewLimit"
      label="Max. a mostrar en vista previa"
      type="number"
      min="1"
      @update:model-value="emitInput"
    />

    <UiUpload
      v-model="innerValue.files"
      multiple
      xxx-endpoint="props.endpoint"
      endpoint="http://phi.local/api/1/stories/tojcpfpis2a/files"
      :allowed-file-types="['image/*']"
      @update:model-value="emitInput"
    />
  </div>
</template>

<style lang="scss">
.MediaGalleryEditor {
  .UiUpload__file {
    max-width: none;
  }
}
</style>