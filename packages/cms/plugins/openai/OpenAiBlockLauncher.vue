<script setup>
import { ref } from 'vue'

import { UiInput, UiButton } from '@/packages/ui'
import { useApi } from '@/packages/api'
import aiApi from './api.js'

/*
emits an input event
containing an ARRAY of Phi blocks
*/
const emit = defineEmits(['accept', 'cancel'])

const api = useApi(aiApi)

const apiKey = ref('')
const prompt = ref('')
const temp = ref(0.7)

const isLoading = ref(false)
const error = ref(null)

async function generateBlocks() {
  isLoading.value = true
  error.value = null
  try {
    const response = await api.getBlocks(prompt.value, apiKey.value, temp.value)
    if (response?.error) {
      throw response.error
    }
    isLoading.value = false

    if (!Array.isArray(response)) {
      throw null
    }

    const finalBlock = {
      component: 'LayoutGroup',
      title: 'OpenAi generated',
      slot: response,
    }

    // Append a submit button if there are input fields
    if (response.some((block) => block.component.toLowerCase().startsWith('input'))) {
      finalBlock.slot.push({
        component: 'InputButton',
        props: {
          type: 'submit',
          label: 'Submit',
        },
      })
    }

    emit('accept', finalBlock)

  } catch (err) {
    error.value = err?.message || err?.body?.props?.message || 'Error generating blocks. Click to retry'
    isLoading.value = false
  }
}
</script>

<template>
  <form
    class="OpenAiBlockLauncher"
    @submit.prevent="generateBlocks"
  >
    <UiInput
      v-model="apiKey"
      type="text"
      placeholder="OpenAI API Key"
      required
      @update:model-value="error = null"
    />

    <UiInput
      v-model="prompt"
      type="textarea"
      placeholder="Write a content description here"
      required
      @update:model-value="error = null"
    />

    <footer class="OpenAiBlockLauncher__footer">
      <UiButton
        type="submit"
        :is-loading="isLoading"
        loading-label="Generating ..."
        label="Generate"
        :error="error"
      />
      <UiButton
        class="UiButton--cancel"
        type="button"
        label="Cancel"
        @click="emit('cancel')"
      />
    </footer>
  </form>
</template>

<style lang="scss">
form.OpenAiBlockLauncher { //clashing with D:\www\phi\frontend\cms-plugins\openai\OpenAiBlockLauncher.vue
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;

  input[type=text] {
    width: 100%;
  }

  &__footer {
    display: flex;
    gap: 5px;
  }
}
</style>