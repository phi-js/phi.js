<script setup>
import { ref } from 'vue'
import { Sample as I18nSample } from '@/packages/i18n/components/Sample'
const pickerValue = ref('')

import { useI18n } from '@/packages/i18n'
const messages = {
  en: {
    'i18n.page.globalLocale': 'Default locale',
    'i18n.page.fixedPropLocale': 'Set via prop (fixed: en)',
    'i18n.page.varLocale': 'Set via prop (var)',
  },
  es: {
    'i18n.page.globalLocale': 'Locale predeterminado',
    'i18n.page.fixedPropLocale': 'Establecido via prop (valor fijo "en")',
    'i18n.page.varLocale': 'Establecido via prop (variable)',
  },
  fr: {
    'i18n.page.globalLocale': 'Localé predetrminé',
    'i18n.page.fixedPropLocale': 'Establité avec value fijé "en"',
    'i18n.page.varLocale': 'Establité avec viariablu',
  },
}
const i18n = useI18n(messages)
</script>

<template>
  <div class="docs-page">
    <h1>I18n</h1>
    <p>Crear un componente con textos internacionalizados</p>

    <pre class="docs-code"><code lang="vue">
&lt;script setup>
import { useI18n } from '@/packages/i18n'
import * as myDictionary from './i18n'
const i18n = useI18n(myDictionary)
const now = new Date()
&lt;/script>

&lt;template>
  &lt;div>
    &lt;h1>&#123;{ i18n.t('i18n.sample.word1') }}&lt;/h1>
    &lt;p>&#123;{ i18n.t('globalWord') }}&lt;/p>
    &lt;p>&#123;{ i18n.t('i18n.sample.todayIs') }} &#123;{ i18n.d(now) }}&lt;/p>
    &lt;p>&#123;{ i18n.t('i18n.sample.pleasePay') }} &#123;{ i18n.$(1500, 'usd') }}&lt;/p>
  &lt;/div>
&lt;/template>
    </code></pre>

    <div class="UiGroup">
      <section>
        <label>{{ i18n.t('i18n.page.globalLocale') }}</label>
        <I18nSample />
      </section>

      <section>
        <label>{{ i18n.t('i18n.page.fixedPropLocale') }}</label>
        <I18nSample i18n-language="en" />
      </section>

      <section>
        <label>{{ i18n.t('i18n.page.varLocale') }}
          <select v-model="pickerValue">
            <option value="">--</option>
            <option value="de">de</option>
            <option value="en">en</option>
            <option value="es-CO">es-CO</option>
            <option value="es-ES">es-ES</option>
            <option value="es-MX">es-MX</option>
            <option value="es">es</option>
            <option value="fr">fr</option>
          </select>
        </label>

        <I18nSample :i18n-language="pickerValue" />
      </section>
    </div>
  </div>
</template>
