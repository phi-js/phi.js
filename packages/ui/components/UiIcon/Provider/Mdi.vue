<template>
  <span :class="['mdi', `mdi-${value}`]"></span>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: false,
      default: 'help'
    }
  }
}
</script>

<style>
@import '/public/material-design-icons/css/materialdesignicons.css';
</style>
