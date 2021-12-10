<script setup>
import { ref } from "vue"
import PhidiasNavigationTabs from "./PhidiasNavigationTabs.vue";

const personId = ref("92");
</script>

<template>
  <div id="state-navigation">
    <h1>PhidiasNavigationTabs</h1>
    <input type="text" v-model="personId">
    <PhidiasNavigationTabs :personId="personId" />
  </div>
</template>

<style lang="scss">
#state-navigation {
}
</style>