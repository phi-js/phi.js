<script setup>
import { ref } from 'vue'

import { UiDetails, UiInput, UiButton } from '@/packages/ui'
import { useApi } from '@/packages/api'
import aiApi from './api.js'

/*
emits an input event
containing an ARRAY of Phi blocks
*/
const emit = defineEmits(['input'])

const api = useApi(aiApi)

const apiKey = ref('please')
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

    emit('input', finalBlock)

  } catch (err) {
    error.value = err?.message || err?.body?.props?.message || 'Error generating blocks. Click to retry'
    isLoading.value = false
  }
}
</script>

<template>
  <UiDetails
    class="OpenAiBlockLauncher FinderItem FinderItem--group"
    text="OpenAI"
    group="UiItemFinder"
  >
    <div class="OpenAiBlockLauncher__contents">
      <UiInput
        v-model="prompt"
        type="textarea"
        placeholder="Write a content description here"
        @update:model-value="error = null"
      />
      <UiButton
        :disabled="!prompt"
        :is-loading="isLoading"
        loading-label="Generating ..."
        label="Generate"
        :error="error"
        @click="generateBlocks"
      />
    </div>
  </UiDetails>
</template>

<style lang="scss">
.OpenAiBlockLauncher {
  &__contents {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }

  input[type=text] {
    width: 100%;
  }
}
</style>