<script setup>
import { ref, watch, computed } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput, UiButton } from '@/packages/ui'
import { fillGaps } from './googleTranslate.js'

const props = defineProps({
  /*
  Dictionary Object
  {
    $i18n: {
      "en": "Text in english",
      "es": "Texto en español",
      "de": "Deutschetexten"
    }
  }
  */
  modelValue: {
    type: [String, Object],
    required: false,
    default: null,
  },

  block: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const i18n = useI18n({
  en: { 'DictionaryEditor.autoComplete': 'Autocomplete' },
  es: { 'DictionaryEditor.autoComplete': 'Completar' },
})


/*
The "$i18n" property of props.modelValue

modelValue: {
  $i18n: {
    en: 'foo',
    es: 'shoo'
  }
}
--->
innerValue: {
  en: 'foo',
  es: 'shoo'
}
*/
const innerValue = ref()
watch(
  () => props.modelValue,
  (newValue) => {
    if (typeof newValue == 'string') {
      innerValue.value = { en: newValue.replace(/[{}]/g, '').trim() }
    } else {
      innerValue.value = newValue?.$i18n
        ? JSON.parse(JSON.stringify(newValue.$i18n))
        : { en: '' }
    }
  },
  { immediate: true },
)

/*
[
  {"language": "en", "value": "Text in english"},
  {"language": "es", "value": "Texto en español"},
]
*/
const arrEntries = computed(() => {
  const retval = []
  i18n.availableLocales.value.forEach((existingLocale) => {
    retval.push({
      language: existingLocale.value,
      value: innerValue.value?.[existingLocale.value] || '',
    })
  })

  return retval
})

function onUpdateEntry(entry, newValue) {
  innerValue.value[entry.language] = newValue
  emit('update:modelValue', { $i18n: JSON.parse(JSON.stringify(innerValue.value)) })
}

async function translateMissingWords() {
  const result = await fillGaps(arrEntries.value)
  if (result?.length) {
    result.forEach((translation) => {
      innerValue.value[translation.language] = translation.value
    })
  }
  emit('update:modelValue', { $i18n: JSON.parse(JSON.stringify(innerValue.value)) })
}

const hasMissingEntries = computed(() => arrEntries.value.some((e) => !e.value || !e.value.trim()))
</script>

<template>
  <div class="DictionaryEditor">
    <UiInput
      v-for="entry in arrEntries"
      :key="entry.language"
      :model-value="entry.value"
      type="text"
      :label="entry.language"
      @update:model-value="onUpdateEntry(entry, $event)"
    />

    <UiButton
      v-if="hasMissingEntries"
      icon="mdi:translate"
      :label="i18n.t('DictionaryEditor.autoComplete')"
      @click="translateMissingWords"
    />
  </div>
</template>