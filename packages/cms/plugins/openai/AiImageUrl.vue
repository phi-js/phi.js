<script setup>
import { ref } from 'vue'
import { UiInput } from '@/packages/ui'
import { useApi } from '@/packages/api'
import openAiApi from './api.js'

const emit = defineEmits(['update:modelValue'])

const api = useApi(openAiApi)

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
    emit('update:modelValue', resultUrl)
  }
}
</script>

<template>
  <div class="AiImageUrl">
    <UiInput
      v-model="prompt"
      type="textarea"
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
  </div>
</template>