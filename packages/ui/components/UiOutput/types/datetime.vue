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

  format: {
    type: [String, Object],
    required: false,
    default: () => ({}),
  },
})
</script>

<template>
  <UiItem
    icon="mdi:calendar"
    :text="i18n.datetime(props.value, props.format)"
  />
</template>