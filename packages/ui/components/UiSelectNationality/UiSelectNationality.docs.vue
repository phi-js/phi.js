<script setup>
import { ref } from 'vue'

import { UiInput } from '../UiInput'
import UiSelectNationality from './UiSelectNationality.vue'

const countrySingle = ref('')
const countryMany = ref([])

</script>

<template>
  <div class="UiSelectNationality-docs">
    <h1>UiSelectNationality</h1>
    <p>
      Thanks to <a
        href="https://github.com/umpirsky/country-list/tree/master/data"
        target="_blank"
      >umpirsky/country-list</a>
    </p>


    <UiSelectNationality
      v-model="countrySingle"
      placeholder="Nationality (one)"
    />

    <UiSelectNationality
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
      type="text"
      placeholder="Nationality (one)"
    />

    <UiInput
      v-model="countryMany"
      label="Nationality"
      type="text"
      placeholder="Nationality (many)"
      multiple
    />
  </div>
</template>