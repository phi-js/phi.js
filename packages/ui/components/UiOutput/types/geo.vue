<script setup>
import { UiItem } from '../../UiItem'

defineProps({
  value: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
</script>

<template>
  <a
    :href="`https://www.google.com/maps/@${value.lat},${value.lng},15z`"
    target="_blank"
  >
    <UiItem
      icon="mdi:map-marker"
      :text="value.lat + ', ' + value.lng"
    />
  </a>
</template>