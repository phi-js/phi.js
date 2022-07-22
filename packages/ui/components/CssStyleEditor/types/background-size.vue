<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const i18n = useI18n({
  en: {
    'CssBackgroundSize.auto': 'auto',
    'CssBackgroundSize.cover': 'cover',
    'CssBackgroundSize.contain': 'contain',
  },
  es: {
    'CssBackgroundSize.auto': 'Original',
    'CssBackgroundSize.cover': 'Cubrir contenedor',
    'CssBackgroundSize.contain': 'Ajustar dentro del contenedor',
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
  <div class="CssBackgroundSize">
    <UiInput
      v-model="innerValue"
      type="select-native"
      :options="[
        { value: 'auto', text: i18n.t('CssBackgroundSize.auto') },
        { value: 'cover', text: i18n.t('CssBackgroundSize.cover') },
        { value: 'contain', text: i18n.t('CssBackgroundSize.contain') },
      ]"
      @update:model-value="emitUpdate()"
    />
  </div>
</template>