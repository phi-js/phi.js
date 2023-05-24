<script setup>
import { ref, watchEffect } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiSelect } from '@/packages/ui'

const i18n = useI18n()
const countryOptions = ref([])

watchEffect(async () => {
  let imported = null
  try {
    imported = await import(`./data/${i18n.baseLanguage.value}/country.json`)
  } catch (e) {
    imported = await import('./data/en/country.json')
  }

  if (!imported?.default) {
    return
  }

  countryOptions.value = Object.keys(imported.default)
    .map((countryCode) => {
      return {
        text: imported[countryCode],
        value: countryCode,
      }
    })
})

</script>

<template>
  <UiSelect
    class="UiSelectCountry"
    :options="countryOptions"
  />
</template>