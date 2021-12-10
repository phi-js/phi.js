<script setup>
import { ref, watch } from "vue";
import { UiTree } from '/packages/ui'
// import { useApi } from '/packages/api'
import exampleJson from "./example.js"

const props = defineProps({
  personId: {
    type: String,
    required: true,
  }
})

async function fetchMenu() {
  return exampleJson
}

const menu = ref()
watch(
  () => props.personId,
  async (value) => menu.value = await fetchMenu(),
  { immediate: true }
)
</script>

<template>
  <div class="phidias-navigation">
    <p>Hola menu izq: {{ personId }}</p>

    <UiTree v-if="menu" :value="menu.tabs">
      <template #item="{ item }">
        <div>
          {{ item.text }}
          <small>{{ item.url }}</small>
        </div>
        <!-- <pre>{{ item }}</pre> -->
      </template>
    </UiTree>

    <p v-else>Cargando...</p>
  </div>
</template>

<style lang="scss">
.phidias-navigation {
  .ui-tree {
    transition: all 0.2s ease;

    &__item--active {
      background: red;
    }
  }
}
</style>