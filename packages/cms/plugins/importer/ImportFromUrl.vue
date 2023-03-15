<script setup>
import { ref } from 'vue'

import { UiInput, UiButton } from '@/packages/ui'
import { useApi } from '@/packages/api'
import importApi from './api.js'

/*
emits an ACCEPT event
containing a single PHI BLOCK: A LayoutGroup block with the imported blocks
*/
const emit = defineEmits(['accept', 'cancel'])

const api = useApi(importApi)

const sourceUrl = ref('')
const isLoading = ref(false)
const error = ref(null)

async function generateBlocks() {
  isLoading.value = true
  error.value = null
  try {
    const response = await api.getBlocks(sourceUrl.value)
    if (response?.error) {
      throw response.error
    }
    isLoading.value = false

    if (!Array.isArray(response)) {
      throw null
    }

    emit('accept', {
      component: 'LayoutGroup',
      title: sourceUrl.value,
      slot: response,

      sourceUrl: sourceUrl.value,
    })

  } catch (err) {
    error.value = err?.message || err?.body?.props?.message || 'Error generating blocks. Click to retry'
    isLoading.value = false
  }
}
</script>

<template>
  <form
    class="ImportFromUrl"
    @submit.prevent="generateBlocks"
  >
    <UiInput
      v-model="sourceUrl"
      type="text"
      placeholder="URL (TypeForm, Google forms, etc.)"
      required
      @update:model-value="error = null"
    />
    <footer class="ImportFromUrl__footer">
      <UiButton
        type="sumit"
        :is-loading="isLoading"
        loading-label="Importing ..."
        label="Import"
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
.ImportFromUrl {
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