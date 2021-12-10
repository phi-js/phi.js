<script setup>
import { ref, watch } from "vue";
import { UiItem } from '/packages/ui'
// import { useApi } from '/packages/api'
import exampleJson from "./example.js"

const props = defineProps({
  personId: {
    type: String,
    required: true,
  }
})

async function fetchMenu(personId) {
  const jsonTest = JSON.parse(JSON.stringify(exampleJson))

  jsonTest.tabs.push({
    id: `person:${personId}`,
    icon: "https://phidias-storage-1.s3.amazonaws.com/santarsicio/pictures/current/thumb_86f9192386370464dad1c68c0d20b1e3.jpg",
    text: "Otra persona",
    subtext: personId,
    children: []
  })

  return jsonTest
}

const menu = ref()
watch(
  () => props.personId,
  async (newValue) => menu.value = await fetchMenu(newValue),
  { immediate: true }
)
</script>

<template>
  <div class="phidias-navigation-tabs">
    <p>Hola menu izq: {{ personId }}</p>

    <ul v-if="menu">
      <li v-for="(tab, key) in menu.tabs" :key="key">
        <UiItem class="ui--clickable" v-bind="tab" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.phidias-navigation-tabs {
}
</style>