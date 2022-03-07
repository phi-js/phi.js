<script setup>
import { UiItem } from '../../../../../ui';

defineProps({
  href: {
    type: String,
    required: false,
    default: '#',
  },

  target: {
    type: String,
    required: false,
    default: '_system',
  },

  text: {
    type: String,
    required: false,
    default: 'Sin título',
  },

  subtext: {
    type: String,
    required: false,
    default: '',
  },

  icon: {
    type: String,
    required: false,
    default: 'mdi:open-in-new',
  },
})
</script>

<template>
  <a class="MediaLink" :href="href" :target="target">
    <UiItem class="ui--clickable" :text="text" :subtext="subtext" :icon="icon"></UiItem>
  </a>
</template>

<style lang="scss">
.MediaLink {
  display: block;
}
</style>