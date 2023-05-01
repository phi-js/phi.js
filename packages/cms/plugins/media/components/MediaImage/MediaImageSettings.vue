<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiTabs, UiTab, UiInput } from '@/packages/ui'
import OpenAiImage from '../../../openai/OpenAiImage.vue'

const i18n = useI18n({
  en: {
    'MediaImageSettings.Image': 'Image',
    'MediaImageSettings.Link': 'Link',
    'MediaImageSettings.OpenLinkIn': 'Open in',
    'MediaImageSettings.NewTab': 'New tab',
    'MediaImageSettings.CurrentTab': 'Current tab',
  },
  es: {
    'MediaImageSettings.Image': 'Imagen',
    'MediaImageSettings.Link': 'Vínculo',
    'MediaImageSettings.OpenLinkIn': 'Abrir en',
    'MediaImageSettings.NewTab': 'Pestaña nueva',
    'MediaImageSettings.CurrentTab': 'Pestaña actual',
  },
})

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },

  /* File uploads URL */
  endpoint: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const block = ref()
watch(
  () => props.modelValue,
  () => {
    block.value = { ...props.modelValue }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...block.value })
}
</script>

<template>
  <UiTabs class="MediaImageSettings">
    <UiTab :text="i18n.t('MediaImageSettings.Image')">
      <div class="UiForm">
        <UiInput
          v-model="block.props.src"
          type="url"
          label="URL"
          :endpoint="props.endpoint"
          debounce="700"
          @update:model-value="emitUpdate"
        />

        <UiInput label="Generate image (DALL·E 2)">
          <OpenAiImage @input="block.props.src = $event; emitUpdate()" />
        </UiInput>
      </div>
    </UiTab>

    <UiTab :text="i18n.t('MediaImageSettings.Link')">
      <div class="UiForm">
        <UiInput
          v-model="block.props.href"
          type="text"
          placeholder="http://"
          @update:model-value="emitUpdate"
        />

        <UiInput
          v-model="block.props.target"
          :disabled="!block.props.href"
          type="select-list"
          :options="[
            {value: '_blank', text: i18n.t('MediaImageSettings.NewTab')},
            {value: '', text: i18n.t('MediaImageSettings.CurrentTab')},
          ]"
          :label="i18n.t('MediaImageSettings.OpenLinkIn')"
          @update:model-value="emitUpdate"
        />
      </div>
    </UiTab>
  </UiTabs>
</template>