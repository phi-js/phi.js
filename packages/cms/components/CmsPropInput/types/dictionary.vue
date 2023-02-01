<script setup>
import { ref, watch, computed } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput, UiButton, UiDialog, UiItem } from '@/packages/ui'
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
  i18n.availableLanguages.forEach((languageInfo) => {
    retval.push({
      language: languageInfo.value,
      value: innerValue.value?.[languageInfo.value] || '',
      label: languageInfo.text,
    })
  })

  return retval
})

function onUpdateEntry(entry, newValue) {
  innerValue.value[entry.language] = newValue
  // emit('update:modelValue', { $i18n: JSON.parse(JSON.stringify(innerValue.value)) })
}

async function translateMissingWords() {
  const result = await fillGaps(arrEntries.value)
  if (result?.length) {
    result.forEach((translation) => {
      innerValue.value[translation.language] = translation.value
    })
  }
  // emit('update:modelValue', { $i18n: JSON.parse(JSON.stringify(innerValue.value)) })
}

const hasMissingEntries = computed(() => arrEntries.value.some((e) => !e.value || !e.value.trim()))

function accept() {
  emit('update:modelValue', { $i18n: JSON.parse(JSON.stringify(innerValue.value)) })
  return true
}

function cancel() {
  // reset innerValue
  if (typeof props.modelValue == 'string') {
    innerValue.value = { en: props.modelValue.replace(/[{}]/g, '').trim() }
  } else {
    innerValue.value = props.modelValue?.$i18n
      ? JSON.parse(JSON.stringify(props.modelValue.$i18n))
      : { en: '' }
  }
  return true
}

const triggerItemProps = computed(() => {
  return {
    icon: 'mdi:translate',
    text: i18n.obj({ $i18n: innerValue.value })
      || arrEntries.value?.[0]?.value
      || 'Translate',
  }
})

</script>

<template>
  <UiDialog class="DictionaryEditor">
    <template #trigger>
      <UiItem
        class="DictionaryEditor__trigger UiInput__element"
        v-bind="triggerItemProps"
      />
    </template>

    <template #contents>
      <div class="DictionaryEditor__box">
        <UiInput
          v-for="entry in arrEntries"
          :key="entry.language"
          :model-value="entry.value"
          type="text"
          :label="entry.label"
          @update:model-value="onUpdateEntry(entry, $event)"
        />

        <UiButton
          icon="mdi:translate"
          :disabled="!hasMissingEntries"
          :label="i18n.t('DictionaryEditor.autoComplete')"
          @click="translateMissingWords"
        />
      </div>
    </template>

    <template #footer="{ close }">
      <footer class="DictionaryEditor__footer">
        <UiButton
          :label="i18n.t('Accept')"
          @click="accept() && close()"
        />
        <UiButton
          class="UiButton--cancel"
          :label="i18n.t('Cancel')"
          @click="cancel() && close()"
        />
      </footer>
    </template>
  </UiDialog>
</template>

<style lang="scss">
@import '@/packages/ui/themes/base/modifiers/clickable.scss';

.DictionaryEditor {
  &__trigger {
    @extend .ui--clickable;
    --ui-item-padding: 10px 12px;
  }

  &__box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 5px;
    padding-left: 1rem;
  }

  &__footer {
    padding: 5px;
    display: flex;
    gap: 5px;
    margin-top: 1rem;
  }

  .UiInput {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &__label {
      min-width: 80px;
    }

    &__body {
      min-width: 300px;
      flex: 1;
    }
  }
}
</style>