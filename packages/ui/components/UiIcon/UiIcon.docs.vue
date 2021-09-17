<script setup>
import { ref } from 'vue';
import { UiIcon, UiItem } from '/packages/ui/components';
import allMdiIcons from './Provider/Mdi.js';

const curIcon = ref('mdi:vuejs');

</script>

<template>
  <h1>UiIcon</h1>

  <select v-model="curIcon">
    <option v-for="(icon,i) in allMdiIcons" :key="i" :value="`mdi:${icon}`" v-text="`mdi:${icon}`"></option>
  </select>

  <div>
    <UiIcon :value="curIcon" />
    <UiIcon :value="curIcon" style="font-size: 2em" />
    <UiIcon :value="curIcon" style="font-size: 3em" />
    <UiIcon :value="curIcon" style="font-size: 4em" />
    <UiIcon :value="curIcon" style="font-size: 6em; color: green" />
  </div>

  <UiItem text="Hello world" :icon="curIcon" :secondary="curIcon" />
</template>