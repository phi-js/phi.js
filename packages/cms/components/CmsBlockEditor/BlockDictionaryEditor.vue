<script setup>
import { ref, watchEffect } from 'vue'
import { UiTabs, UiTab, UiItem } from '../../../ui'

const props = defineProps({
  /*
  BLOCK object
  */
  modelValue: {
    type: Object,
    required: true,
  },

  currentLanguage: {
    type: String,
    required: false,
    default: 'es',
  },
})

const emit = defineEmits(['update:modelValue', 'update:currentLanguage'])

const availableLanguages = ['en', 'es', 'de', 'fr']

const innerBlock = ref()
watchEffect(() => innerBlock.value = { ...props.modelValue })

function emitUpdate() {
  emit('update:modelValue', { ...innerBlock.value })
}

const terms = ref([])
watchEffect(() => {
  terms.value = []
  const matches = JSON.stringify(innerBlock.value).matchAll(/lang\(([^"]+?)\)/g)
  for (const match of matches) {
    terms.value.push(match[1])
  }
})

function setTerm(termKey, targetLanguage, targetValue) {
  if (!innerBlock.value.i18n) {
    innerBlock.value.i18n = {}
  }

  if (!innerBlock.value.i18n[targetLanguage]) {
    innerBlock.value.i18n[targetLanguage] = {}
  }

  innerBlock.value.i18n[targetLanguage][termKey] = targetValue
}


async function googleTranslate(arrTerms, targetLanguage) {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
      q: arrTerms,
      target: targetLanguage,
    }),
  }).then((r) => r.json())

  if (!response?.data?.translations?.length) {
    return (new Array(arrTerms.length)).fill(null)
  }

  return response.data.translations.map((r) => r.translatedText)
}

async function translateAll(sourceLanguage, targetLanguage) {
  const sourceTerms = Object.values(innerBlock.value.i18n?.[sourceLanguage])
  if (!sourceTerms.length) {
    return
  }

  const translated = await googleTranslate(sourceTerms, targetLanguage)

  Object.keys(innerBlock.value.i18n[sourceLanguage]).forEach((termKey, i) => {
    setTerm(termKey, targetLanguage, translated[i])
  })

  emitUpdate()
}
</script>

<template>
  <div class="BlockDictionaryEditor">
    <UiTabs
      :model-value="currentLanguage"
      @update:modelValue="emit('update:currentLanguage', $event)"
    >
      <UiTab
        v-for="lang in availableLanguages"
        :key="lang"
        :value="lang"
        :text="lang"
      >
        <div class="UiForm">
          <table
            width="100%"
            cellspacing="0"
            cellpadding="0"
          >
            <tbody>
              <tr
                v-for="term in terms"
                :key="term"
              >
                <td>{{ term }}</td>
                <td>
                  <input
                    type="text"
                    class="UiInput"
                    :value="innerBlock.i18n?.[lang]?.[term]"
                    @input="setTerm(term, lang, $event.target.value); emitUpdate();"
                  >
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>&nbsp;</td>
                <td>
                  <UiItem
                    v-if="lang != 'en'"
                    icon="mdi:google-translate"
                    text="Google Translate"
                    :subtext="`From 'en' to '${lang}'`"
                    style="display:inline-flex"
                    @click="translateAll('en', lang)"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </UiTab>
    </UiTabs>

    <!-- <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
    >
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th
            v-for="lang in availableLanguages"
            :key="lang"
          >
            {{ lang }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="term in terms"
          :key="term"
        >
          <td>{{ term }}</td>
          <td
            v-for="(lang, i) in availableLanguages"
            :key="lang"
          >
            <input
              :tabindex="i+1"
              :value="innerBlock.i18n?.[lang]?.[term]"
              type="text"
              @input="setTerm(term, lang, $event.target.value); emitUpdate();"
            >
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>&nbsp;</td>
          <td
            v-for="lang in availableLanguages"
            :key="lang"
          >
            <button
              v-if="lang != 'en'"
              @click="translateAll('en', lang)"
            >
              Goo
            </button>
          </td>
        </tr>
      </tfoot>
    </table> -->
  </div>
</template>