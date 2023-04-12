<script setup>
import { ref, watch, computed, inject } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'

const currentStory = inject('_cms_currentStory', {})

const i18n = useI18n({
  en: {
    'LayoutPageSettings.Title': 'Title',
    'LayoutPageSettings.HeaderAndFooter': 'Header & Footer',
    'LayoutPageSettings.isHeaderEnabled': 'Show header',
    'LayoutPageSettings.isFooterEnabled': 'Show footer',
  },
  es: {
    'LayoutPageSettings.Title': 'Título',
    'LayoutPageSettings.HeaderAndFooter': 'Encabezado & Pie',
    'LayoutPageSettings.isHeaderEnabled': 'Encabezado de página',
    'LayoutPageSettings.isFooterEnabled': 'Pie de página',
  },
})

const props = defineProps({
  /*
  Page object (i.e. CmsBlock component=LayoutPage)
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:model-value'])

const page = ref()
const isHashDirty = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    page.value = { ...newValue }
    isHashDirty.value = !!page.value.id
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:model-value', { ...page.value })
}

function onTitleChange() {
  if (!isHashDirty.value) {
    page.value.hash = toValidHash(page.value.title)
  }
}

function toValidHash(string) {
  if (!string) {
    return ''
  }

  return i18n.obj(string)
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 16)
}

const isHeaderEnabled = computed({
  get() {
    if (page.value?.isHeaderEnabled === true) {
      return true
    }
    if (page.value?.isHeaderEnabled === false) {
      return false
    }
    return currentStory.value.header?.length > 0
  },
  set(isEnabled) {
    page.value.isHeaderEnabled = !!isEnabled
    emitUpdate()
  },
})

const isFooterEnabled = computed({
  get() {
    if (page.value?.isFooterEnabled === true) {
      return true
    }
    if (page.value?.isFooterEnabled === false) {
      return false
    }
    return currentStory.value.footer?.length > 0
  },
  set(isEnabled) {
    page.value.isFooterEnabled = !!isEnabled
    emitUpdate()
  },
})
</script>

<template>
  <div class="LayoutPageSettings UiForm">
    <CmsPropInput
      v-model="page.title"
      type="text"
      :label="i18n.t('LayoutPageSettings.Title')"
      @update:model-value="onTitleChange(); emitUpdate();"
    />
    <UiInput
      v-model="page.hash"
      type="text"
      label="Hash"
      @update:model-value="isHashDirty = true; emitUpdate();"
    />

    <fieldset>
      <legend>{{ i18n.t('LayoutPageSettings.HeaderAndFooter') }}</legend>
      <UiInput
        v-model="isHeaderEnabled"
        type="checkbox"
        :placeholder="i18n.t('LayoutPageSettings.isHeaderEnabled')"
        @update:model-value="emitUpdate()"
      />
      <UiInput
        v-model="isFooterEnabled"
        type="checkbox"
        :placeholder="i18n.t('LayoutPageSettings.isFooterEnabled')"
        @update:model-value="emitUpdate()"
      />
    </fieldset>
  </div>
</template>