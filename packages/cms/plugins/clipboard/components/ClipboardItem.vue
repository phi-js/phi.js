<script setup>
import { computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiItem } from '@/packages/ui'
import clipboardApi from '../api'

const i18n = useI18n({
  en: {
    'ClipboardItem.Copied': 'Copied!',
    'ClipboardItem.Copy': 'Copy',
  },
  es: {
    'ClipboardItem.Copied': 'Copiado!',
    'ClipboardItem.Copy': 'Copiar',
  },
})

const props = defineProps({
  /* BLOCK object */
  block: {
    type: Object,
    required: true,
  },
})

const isCopied = computed(() => !!clipboardApi.contents[props.block._key])

function toggle() {
  return isCopied.value ? clipboardApi.remove(props.block) : clipboardApi.copy(props.block)
}
</script>

<template>
  <UiItem
    class="BlockScaffold__action BlockScaffold__action--copy"
    :text="i18n.t(isCopied ? 'ClipboardItem.Copied' : 'ClipboardItem.Copy')"
    :icon="isCopied ? 'mdi:checkbox-multiple-marked-outline' : 'mdi:checkbox-multiple-blank-outline'"
    @click="toggle"
  />
</template>