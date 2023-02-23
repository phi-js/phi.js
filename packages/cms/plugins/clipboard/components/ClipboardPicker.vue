<script setup>
import { computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiItem, UiDetails } from '@/packages/ui'

import clipboardApi from '../api'

const i18n = useI18n({
  en: { 'ClipboardPicker.Clipboard': 'Clipboard' },
  es: { 'ClipboardPicker.Clipboard': 'Portapapeles' },
})

const copiedItems = computed(() => {
  const blocks = Object.values(clipboardApi.contents)
  if (!blocks.length) {
    return []
  }
  return blocks
})

const emit = defineEmits(['input'])

function pasteBlock(block) {
  emit('input', {
    ...block,
    _key: undefined,
  })
}
</script>

<template>
  <UiDetails
    v-if="copiedItems.length"
    class="ClipboardPicker FinderItem FinderItem--group"
    :text="i18n.t('ClipboardPicker.Clipboard')"
  >
    <UiItem
      v-for="item in copiedItems"
      :key="item.block._key"
      class="FinderItem FinderItem--item"
      :text="item.definition.title"
      :subtext="i18n.d(item.timestamp)"
      :icon="item.definition.icon"
      @click="pasteBlock(item.block)"
      @delete="clipboardApi.remove(item.block)"
    />
  </UiDetails>
</template>