<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [Date, Number, String, Boolean],
    required: false,
    default: null,
  },

  options: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const displayValue = computed(() => props.options.find((e) => e?.value == props.value) || { text: props.value })
</script>

<template>
  <span v-text="(displayValue?.text || pops.value)" />
</template>