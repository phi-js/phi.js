<script setup>
import { ref } from 'vue'
import { UiInput } from '@/packages/ui'
import { useApi } from '@/packages/api'
import openAiApi from './api.js'

const api = useApi(openAiApi)

const props = defineProps({
  existing: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['input'])

const prompt = ref('')
const isLoading = ref(false)
const error = ref('')

async function generateText() {

  const strPrompt = props.existing
    ? `given the following text: ${props.existing}\n${prompt.value}`
    : prompt.value

  error.value = ''
  isLoading.value = true
  try {
    const response = await api.generateText({
      apiKey: 'please',
      prompt: strPrompt + '\nreply with HTML formatted text',
    })

    if (response.error) {
      throw response.error
    }

    emit('input', response)
  } catch (err) {
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
      @click="generateText"
    />
  </div>
</template>