<script setup>
import { ref } from 'vue'
import { UiInput } from '@/packages/ui'
import { useApi } from '@/packages/api'
import openAiApi from './api.js'

const props = defineProps({
  existing: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['input'])

const api = useApi(openAiApi)

const prompt = ref('')
const isLoading = ref(false)
const error = ref('')

async function generateCss() {
  error.value = ''
  isLoading.value = true
  try {
    const strPrompt = props.existing
      ? `given the following styles: ${JSON.stringify(props.existing)}\n${prompt.value}`
      : prompt.value

    const response = await api.generateCss({
      apiKey: 'please',
      prompt: strPrompt,
    })

    if (response.error) {
      throw response.error
    }

    emit('input', response)
  } catch (err) {
    console.error(err)
    error.value = 'Error'
  }
  isLoading.value = false
}
</script>

<template>
  <div class="OpenAiText">
    <UiInput
      v-model="prompt"
      type="textarea"
      label="Prompt"
      @update:model-value="error = ''"
    />

    <UiInput
      type="button"
      label="Generate"
      loading-label="Generating ..."
      :is-loading="isLoading"
      :error="error"
      :disabled="!prompt"
      @click="generateCss"
    />
  </div>
</template>