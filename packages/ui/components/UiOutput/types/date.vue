<script setup>
import { UiItem } from '../../UiItem'
import { useI18n } from '../../../../i18n'
const i18n = useI18n()

const props = defineProps({
  value: {
    type: [Date, Number, String],
    required: false,
    default: null,
  },
})
</script>

<template>
  <UiItem
    icon="mdi:calendar"
    :text="i18n.d(props.value)"
  />
  <!-- <span v-text="i18n.d(props.value)" /> -->
</template>