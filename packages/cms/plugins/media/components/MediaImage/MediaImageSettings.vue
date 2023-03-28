<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'
import OpenAiImage from '../../../openai/OpenAiImage.vue'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },

  /* File uploads URL */
  endpoint: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const block = ref()
watch(
  () => props.modelValue,
  () => {
    block.value = { ...props.modelValue }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...block.value })
}
</script>

<template>
  <div class="MediaImageSettings UiForm">
    <UiInput label="Generate image (DALL·E 2)">
      <OpenAiImage @input="block.props.src = $event; emitUpdate()" />
    </UiInput>

    <UiInput
      v-model="block.props.src"
      type="url"
      label="URL de la imágen"
      :endpoint="props.endpoint"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="block.props.href"
      type="text"
      label="Vínculo"
      placeholder="http://"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="block.props.target"
      :disabled="!block.props.href"
      type="select-list"
      :options="[
        {value: '_blank', text: 'Nueva pestaña'},
        {value: '', text: 'Pestaña actual'},
      ]"
      label="Abrir vínculo en"
      @update:model-value="emitUpdate"
    />
  </div>
</template>