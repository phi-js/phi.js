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
  String. A background-size value
  e.g:. "cover", "contain", "auto"
  */
  modelValue: {
    type: String,
    required: false,
    default: null,
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
  <div class="CssBackgroundAttachment">
    <UiInput
      v-model="innerValue"
      type="select-native"
      :options="[
        { value: 'scroll', text: i18n.t('CssBackgroundAttachment.scroll') },
        { value: 'fixed', text: i18n.t('CssBackgroundAttachment.fixed') },
        { value: 'local', text: i18n.t('CssBackgroundAttachment.local') },
      ]"
      @update:model-value="emitUpdate()"
    />
  </div>
</template>