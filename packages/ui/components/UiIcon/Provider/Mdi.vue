<template>
  <span :class="['mdi', `mdi-${value}`]" />
</template>

<script>
import './material-design-icons/css/materialdesignicons.css'

export default {
  props: {
    value: {
      type: String,
      required: false,
      default: 'help',
    },
  },
}
</script>