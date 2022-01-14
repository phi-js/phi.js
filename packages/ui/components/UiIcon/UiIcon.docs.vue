<script setup>
import { ref } from 'vue'
import { UiIcon, UiItem } from '@/packages/ui/components'
import allMdiIcons from './Provider/Mdi.js'

const curIcon = ref('mdi:vuejs')
</script>

<template>
  <h1>UiIcon</h1>

  <select v-model="curIcon">
    <option
      v-for="(icon, i) in allMdiIcons"
      :key="i"
      :src="`mdi:${icon}`"
      v-text="`mdi:${icon}`"
    />
  </select>

  <div>
    <UiIcon :src="curIcon" />
    <UiIcon
      :src="curIcon"
      style="font-size: 2em"
    />
    <UiIcon
      :src="curIcon"
      style="font-size: 3em"
    />
    <UiIcon
      :src="curIcon"
      style="font-size: 4em"
    />
    <UiIcon
      :src="curIcon"
      style="font-size: 6em; color: green"
    />
  </div>

  <UiItem
    text="Hello world"
    :icon="curIcon"
    :subtext="curIcon"
  />
</template>
