<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: false,
    default: '',
  },

  text: {
    type: String,
    required: false,
    default: null,
  },

  target: {
    type: String,
    required: false,
    default: '_blank',
  },
})

const href = computed(() => {
  if (props.value.substring(0, 4) != 'http') {
    return 'https://' + props.value
  }
  return props.value
})

</script>

<template>
  <a
    :href="href"
    :target="props.target"
    v-text="props.text || props.value"
  />
</template>