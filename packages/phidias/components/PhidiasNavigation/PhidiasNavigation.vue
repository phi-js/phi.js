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

    <UiTree v-if="menu" :value="menu.tabs" children-prop="subitems" class="PhidiasMenu">
      <template #default="{ item, toggle, isOpen }">
        <div
          :class="['PhidiasMenu__item', { 'PhidiasMenu__item--open': isOpen, 'PhidiasMenu__item--closed': !isOpen }]"
          :style="{'background': isOpen ? item.color : null}"
          @click="toggle"
        >
          {{ item.text }} - {{ isOpen }}
          <small>{{ item.url }}</small>
        </div>
      </template>
    </UiTree>

    <p v-else>Cargando...</p>

    <!-- <pre>{{ menu }}</pre> -->
  </div>
</template>

<style lang="scss">
.PhidiasMenu {
  border: 1px solid blue;

  &__item {
    transition: all .2s ease;
    border: 1px solid red;

    &--open {
      background: red;
    }

    &--closed {
      background: #dedede;
    }
  }

  .UiTree {
    &__face {

    }

    &__children {
      margin-left: 0px;
      transition: all .3s ease;
      
      &--open {
        margin-left: 20px;
      }
    }
  }
}
</style>