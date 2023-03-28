<script setup>
import { inject, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const i18n = useI18n({
  en: {
    'NavigationPagePicker.NextPage': 'Next page',
    'NavigationPagePicker.PreviousPage': 'Previous page',
  },
  es: {
    'NavigationPagePicker.NextPage': 'Siguiente',
    'NavigationPagePicker.PreviousPage': 'Anterior',
  },
})

const props = defineProps({
  pageId: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:pageId'])

const injectedStory = inject('_cms_currentStory', null)
const injectedPages = computed(() => injectedStory?.value?.pages || [])
const availablePages = computed(() => [
  {
    text: i18n.t('NavigationPagePicker.NextPage'),
    value: 'next',
  },
  {
    text: i18n.t('NavigationPagePicker.PreviousPage'),
    value: 'back',
  },
  ...injectedPages.value.map((page) => ({
    text: page.title || page.info?.text || page.hash || page.id,
    value: page.id,
  })),
])
</script>

<template>
  <UiInput
    type="select-native"
    :options="availablePages"
    :model-value="props.pageId"
    @update:model-value="emit('update:pageId', $event)"
  />
</template>