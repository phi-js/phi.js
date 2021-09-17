<template>
  <i
    class="material-icons"
    v-text="value"
  ></i>
</template>

<script>
// Material design icons npm package
import 'material-design-icons/iconfont/material-icons.css';

export default {
  name: 'ui-icon-google',

  props: {
    value: {
      type: String,
      required: false,
      default: 'help',
    },
  },
};
</script>

<style lang="scss">
// From https://google.github.io/material-design-icons/
// @import url("https://fonts.googleapis.com/icon?family=Material+Icons");

.ui-icon > .material-icons {
  font-size: inherit;
}
</style>