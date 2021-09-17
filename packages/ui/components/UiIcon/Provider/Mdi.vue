<template>
  <span :class="['mdi',  `mdi-${value}`]"></span>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css';

export default {
  name: 'ui-icon-mdi',
  props: {
    value: {
      type: String,
      required: false,
      default: 'help'
    }
  }
};
</script>