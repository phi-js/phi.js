<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { fillGaps } from '@/packages/i18n/googleTranslate.js'
import { UiDialog, UiInput, UiIcon } from '@/packages/ui'

const i18n = useI18n({
  en: { 'TranslationInput.autoComplete': 'Autocomplete' },
  es: { 'TranslationInput.autoComplete': 'Completar' },
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

function parseIncomingValue(newValue) {
  if (typeof newValue?.$i18n == 'object') {
    return JSON.parse(JSON.stringify(newValue.$i18n))
  }

  return { [i18n.baseLanguage.value]: newValue || '' }
}


/*
innerValue: {
  en: 'foo',
  es: 'shoo',
  de: 'scheisse',
}
*/
const innerValue = ref({})
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = parseIncomingValue(newValue),
  { immediate: true },
)

function emitUpdate() {
  // Clean innerValue: only include languages with values
  const cleanValue = {}
  let isEmpty = true
  for (const [langCode, value] of Object.entries(innerValue.value)) {
    if (value) {
      cleanValue[langCode] = value
      isEmpty = false
    }
  }

  if (isEmpty) {
    emit('update:modelValue', '')
    return
  }

  /* Return string for objects with a single value
  .e.g {$i18n: {en: 'hola'}}  ---> "hola"
  */
  if (Object.keys(cleanValue).length == 1) {
    emit('update:modelValue', Object.values(cleanValue)[0])
    return
  }

  emit('update:modelValue', { $i18n: cleanValue })
}

const faceValue = computed({
  get() {
    const langCode = i18n.baseLanguage.value
    return innerValue.value[langCode] || ''
  },

  set(newValue) {
    const langCode = i18n.baseLanguage.value
    innerValue.value[langCode] = newValue
    emitUpdate()
  },
})


function onDialogAccept() {
  emitUpdate()
}

function onDialogCancel() {
  // Reset innerValue
  innerValue.value = parseIncomingValue(props.modelValue)
}

/* Google Translate widget */
const hasMissingWords = computed(() => {
  return i18n.availableLanguages.some((lang) => !innerValue.value[lang.value] || !innerValue.value[lang.value].trim())
})

async function translateMissingWords() {
  /*
  Build "entries" array (format required by fillGaps)
  [
    {"language": "en", "value": "Text in english"},
    {"language": "es", "value": "Texto en español"},
    {"language": "de", "value": ""},
    {"language": "fr", "value": ""},
  ]
  */
  const entries = []
  i18n.availableLanguages.forEach((languageInfo) => {
    const langCode = languageInfo.value
    entries.push({
      language: langCode,
      value: innerValue.value[langCode] || '',
    })
  })

  const result = await fillGaps(entries)
  if (result?.length) {
    result.forEach((translation) => {
      innerValue.value[translation.language] = translation.value
    })
  }
}

</script>

<template>
  <div
    class="TranslationInput"
    :class="{'TranslationInput--incomplete': hasMissingWords}"
  >
    <input
      v-bind="$attrs"
      v-model="faceValue"
      class="TranslationInput__input"
      type="text"
    >

    <UiDialog
      @accept="onDialogAccept"
      @cancel="onDialogCancel"
    >
      <template #trigger>
        <UiIcon
          class="TranslationInput__icon"
          src="mdi:translate"
          title="Translations"
        />
      </template>
      <template #contents>
        <div class="TranslationInput__box UiForm--wide">
          <UiInput
            v-for="language in i18n.availableLanguages"
            :key="language.value"
            v-model="innerValue[language.value]"
            class="TranslationInput__entry"
            type="text"
            :label="language.text"
          />

          <UiInput
            class="TranslationInput__btnFill"
            type="button"
            icon="mdi:translate"
            :disabled="!hasMissingWords"
            :label="i18n.t('TranslationInput.autoComplete')"
            @click="translateMissingWords"
          />
        </div>
      </template>
    </UiDialog>
  </div>
</template>

<style lang="scss">
.TranslationInput {
  --input-icon-width: 2em;
  display: inline-block;
  position: relative;

  &__input {
    z-index: 0;
    padding-right: var(--input-icon-width);
  }

  &__icon {
    position: absolute;
    z-index: 1;
    top: 4px;
    right: 4px;
    bottom: 4px;
    width: var(--input-icon-width);
    opacity: 0.7;

    cursor: pointer;
    border-radius: 5px;
    &:hover {
      opacity: 1;
      background-color: var(--ui-color-hover);
    }
  }

  &__box {
    padding: 6px;
  }

  &__entry {
    input {
      width: 100%;
    }
  }

  &__btnFill {
    margin-left: auto;
    margin-top: 6px;
  }

  &--incomplete {
    &::after {
      content: '';
      display: block;
      width: 0.5em;
      height: 0.5em;
      border-radius: 50%;
      background: var(--ui-color-danger, red);
      opacity: 0.7;

      position: absolute;
      top: 0.5em;
      right: 0.5em;
    }
  }
}
</style>