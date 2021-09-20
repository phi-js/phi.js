<script setup>
import { useI18n } from '/packages/i18n'
import * as myDictionary from '/packages/placeholder/components/PlaceholderTest/i18n'
const i18n = useI18n(myDictionary)
</script>

<template>
  <h1>I18n</h1>
  <pre class="ui-code"><code>
import { useI18n } from '/packages/i18n'
import { * as myDictionary } from './i18n/'
  </code></pre>

  <select v-model="i18n.locale">
    <option value="en">en</option>
    <option value="es">es</option>
    <option value="de">de</option>
    <option value="fr">fr</option>
  </select>

  <h1>{{ i18n.t('myDictionary.word1') }}</h1>
  <h2>{{ i18n.t('myDictionary.word2') }}</h2>
  <h3>{{ i18n.t('myDictionary.word3') }}</h3>
  <p>{{ i18n.t('myDictionary.globalWord') }}</p>
  <pre>{{ i18n.locale }}</pre>
  <!-- <pre>{{ i18n.messages }}</pre> -->
</template>
