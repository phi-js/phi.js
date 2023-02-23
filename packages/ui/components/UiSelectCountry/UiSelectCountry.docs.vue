<script setup>
import { ref } from 'vue'

import UiSelectCountry from './UiSelectCountry.vue'
import UiSelectCity from './UiSelectCity.vue'

const countrySingle = ref('')
const countryMany = ref([])

const somePerson = ref({
  birthplace_iso_country: '',
  birthplace_iso_province: '',
  birthplace_iso_city: '',
  birthplace_iso_text: '',
})
</script>

<template>
  <div class="UiSelectCountry-docs">
    <h1>UiSelectCountry</h1>
    <p>
      Thanks to <a
        href="https://github.com/umpirsky/country-list/tree/master/data"
        target="_blank"
      >umpirsky/country-list</a>
    </p>

    <UiSelectCountry
      v-model="countrySingle"
      placeholder="Country (one)"
    />

    <UiSelectCountry
      v-model="countryMany"
      placeholder="Country (many)"
      multiple
    />
    <pre>countrySingle: {{ countrySingle }}</pre>
    <pre>countryMany: {{ countryMany }}</pre>

    <hr>

    <h1>UiSelectCity</h1>

    <UiSelectCity
      v-model:country="somePerson.birthplace_iso_country"
      v-model:province="somePerson.birthplace_iso_province"
      v-model:city="somePerson.birthplace_iso_city"
      v-model:text="somePerson.birthplace_iso_text"
    />

    <pre>{{ somePerson }}</pre>
  </div>
</template>