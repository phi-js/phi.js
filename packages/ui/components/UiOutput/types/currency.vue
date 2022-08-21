<script setup>
import { useI18n } from '@/packages/i18n'
const i18n = useI18n()

const props = defineProps({
  value: {
    type: [Number, String],
    required: false,
    default: null,
  },
})
</script>

<template>
  <span v-text="i18n.$(props.value, $attrs.format)" />
</template>