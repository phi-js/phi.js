<script setup>
import { ref } from 'vue'

import { UiDetails, UiInput, UiButton } from '@/packages/ui'
import { useApi } from '@/packages/api'
import importApi from './api.js'

/*
emits an input event
containing an PHI BLOCK: A LayoutGroup block with the migrated typeform fields
*/
const emit = defineEmits(['input'])

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

    emit('input', {
      component: 'LayoutGroup',
      // title: 'Imported',
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
  <UiDetails
    class="ImportFromUrl FinderItem FinderItem--group"
    text="Import"
    group="UiItemFinder"
  >
    <form
      class="ImportFromUrl__contents"
      @submit.prevent="generateBlocks"
    >
      <UiInput
        v-model="sourceUrl"
        type="text"
        placeholder="URL (TypeForm, Google forms, etc.)"
        @update:model-value="error = null"
      />
      <UiButton
        type="submit"
        :is-loading="isLoading"
        loading-label="Loading ..."
        label="Load"
        :error="error"
      />
    </form>
  </UiDetails>
</template>

<style lang="scss">
.ImportFromUrl {
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