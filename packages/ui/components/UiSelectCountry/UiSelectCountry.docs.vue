<script setup>
import { ref } from 'vue'

import { UiInput } from '../UiInput'
import UiSelectCountry from './UiSelectCountry.vue'

const countrySingle = ref('')
const countryMany = ref([])

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
      placeholder="Nationality (one)"
    />

    <UiSelectCountry
      v-model="countryMany"
      placeholder="Nationality (many)"
      multiple
    />

    <UiInput
      type="translation"
      label="Just a text"
    />

    <pre>countrySingle: {{ countrySingle }}</pre>
    <pre>countryMany: {{ countryMany }}</pre>
    <hr>

    <UiInput
      v-model="countrySingle"
      label="Nationality"
      type="country"
      placeholder="Nationality (one)"
    />

    <UiInput
      v-model="countryMany"
      label="Nationality"
      type="country"
      placeholder="Nationality (many)"
      multiple
    />
  </div>
</template>