<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const i18n = useI18n({
  en: {
    'CssBackgroundAttachment.scroll': 'Scroll with page',
    'CssBackgroundAttachment.fixed': 'Remain fixed',
    'CssBackgroundAttachment.local': 'Scroll with element',
  },
  es: {
    'CssBackgroundAttachment.scroll': 'Desplazar con la página',
    'CssBackgroundAttachment.fixed': 'Permanecer fijo',
    'CssBackgroundAttachment.local': 'Desplazar con elemento',
  },
})

const props = defineProps({
  /*
  String. A background-attachment value
  e.g:. "scroll", "fixed", "local"
  */
  modelValue: {
    type: String,
    required: false,
    default: 'scroll',
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref('')
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = newValue,
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', innerValue.value)
}
</script>

<template>
  <UiInput
    v-model="innerValue"
    class="CssBackgroundAttachment"
    type="select-buttons"
    :options="[
      { value: 'scroll', text: i18n.t('CssBackgroundAttachment.scroll') },
      { value: 'fixed', text: i18n.t('CssBackgroundAttachment.fixed') },
      { value: 'local', text: i18n.t('CssBackgroundAttachment.local') },
    ]"
    @update:model-value="emitUpdate()"
  />
</template>