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
    v-if="props.value"
    icon="mdi:calendar"
    :text="i18n.date(props.value, props.format)"
  />
  <span v-else />
</template>