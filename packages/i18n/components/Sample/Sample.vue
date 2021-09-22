<script setup>
import { useI18n } from '/packages/i18n'
import * as myDictionary from './i18n'
const i18n = useI18n(myDictionary)
const now = new Date()
</script>

<template>
  <div>
    <h1>{{ i18n.t('i18n.sample.word1') }}</h1>
    <h2>{{ i18n.t('i18n.sample.word2') }}</h2>
    <h3>{{ i18n.t('i18n.sample.word3') }}</h3>
    <h4>{{ i18n.t('i18n.sample.word4') }}</h4>
    <p>{{ i18n.t('globalWord') }}</p>

    <p>{{ i18n.t('i18n.sample.todayIs') }} {{ i18n.d(now) }}</p>
    <p>
      {{ i18n.t('i18n.sample.todayIs') }}
      {{
        i18n.d(now, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }}
    </p>
    <p>{{ i18n.t('i18n.sample.pleasePay') }} {{ i18n.$(1500, 'usd') }}</p>
    <p>{{ i18n.t('i18n.sample.pleasePay') }} {{ i18n.$(1250, 'eur') }}</p>
    <p>{{ i18n.t('i18n.sample.pleasePay') }} {{ i18n.$(1480220, 'cop') }}</p>
    <p>{{ i18n.t('i18n.sample.pleasePay') }} {{ i18n.$(2500, 'mxn') }}</p>
  </div>
</template>
