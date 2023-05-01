<!-- eslint-disable max-len -->
<script setup>
import { ref } from 'vue'

import { useI18n } from '@/packages/i18n'
import { parse } from '@/packages/vm'
import { useApi } from '@/packages/api'
import { UiChat } from '@/packages/ui'
import openAiApi from '../../plugins/openai/api.js'

import wizardSrc from './wizard-src.json'

const api = useApi(openAiApi)
const emit = defineEmits(['input', 'cancel'])

const i18n = useI18n({
  en: { 'Wizard.assistantPrompt': 'Hi! Tell me about the website you want to create' },
  es: { 'Wizard.assistantPrompt': 'Hola! Cuéntame sobre el sitio web que quieres crear' },
})

const systemPrompt = `
Your goal is to create website according to the user's requirements.
Have a conversation with the user and make sure to infer most details on your own. Only ask concise questions if needed.
When you are ready, reply using ONLY valid JSON (no text, and NO ''' delimiters. JSON ONLY) with a VALID JSON object with the properties:
{
  title: Website title,
  slogan: Website slogan,
  description: Website description,
  colors: { // colors for light/dark modes in valid css color values
    light: {
      background: background color
      primary: primary color
      accent: accent color
      text: font color
    },
    dark: {
      background
      primary
      accent
      text
    },
  },
  images: {
    header: a short description of an image, for example "a sunlit workshop, blurred"
    image1: a short description of an image
    image2: a short description of an image
  },
  template:  a suggested template, one of the following: casual, formal, fun, modern, minimalistic, text-based
}

Do NOT mention to the user anything about JSON
`

const messages = ref([
  {
    role: 'assistant',
    content: i18n.t('Wizard.assistantPrompt'),
  },
])

// When onUserMessage is called, the message is already added to messages.value
async function onUserMessage() {
  const response = await api.postChat({
    apiKey: 'please',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.value,
    ],
  })

  // No response.
  if (!response?.choices?.[0]?.message?.content) {
    return false
  }

  // Look for JSON response
  if (response.choices[0].message.content.startsWith('{')) {
    const responseJson = JSON.parse(response.choices[0].message.content)
    const newStory = parse(wizardSrc, {
      ...responseJson,
      baseUrl: import.meta.env.VITE_PHI_URL || '',
    })
    emit('input', newStory)
    return
  }

  // Reply with text response
  return response.choices[0].message
}
</script>

<template>
  <UiChat
    v-model:messages="messages"
    class="Wizard"
    local-storage-key="phi-wizard"
    @user-message="onUserMessage"
  />
</template>

<style lang="scss">
.Wizard {
  padding: 8px;
  max-height: 460px;

  .UiChat__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;

    button {
      background: transparent;
      border: 0;
      border-radius: 4px;
      padding: 4px 8px;
      font-weight: bold;
      font-family: inherit;
      opacity: 0.7;

      cursor: pointer;
      &:hover {
        opacity: 1;
        background-color: var(--ui-color-hover);
      }
    }
  }
}
</style>