<script setup>
import { ref, watch } from 'vue'

import { UiInput } from '@/packages/ui'
import { useApi } from '@/packages/api'
import openAiApi from '../../../openai/api.js'

const api = useApi(openAiApi)

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

/* DALLE-2 image generator */
const prompt = ref('')
const size = ref('256x256')
const isLoading = ref(false)

async function generateImage({ prompt, n = 1, size = '256x256' }) {
  isLoading.value = true
  const resultUrl = await api.generateImage({
    apiKey: 'please',
    prompt,
    n,
    size,
  })
  isLoading.value = false

  if (resultUrl) {
    block.value.props.src = resultUrl
    emitUpdate()
  }
}
</script>

<template>
  <div class="MediaImageSettings UiForm">
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

    <section>
      <UiInput
        v-model="prompt"
        type="textarea"
        label="Generate image with DALLE-2"
        placeholder="Describe your image here ..."
      />

      <UiInput
        v-model="size"
        type="select-buttons"
        :options="[
          {value: '256x256', text: '256x256'},
          {value: '512x512', text: '512x512'},
          {value: '1024x1024', text: '1024x1024'},
        ]"
      />

      <UiInput
        style="margin-top: 1em"
        type="button"
        label="Generate"
        loading-label="Generating ..."
        :is-loading="isLoading"
        :disabled="!prompt"
        @click="generateImage({prompt, size})"
      />
    </section>
  </div>
</template>