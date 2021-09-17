<template>
  <div
    class="ui-icon-text"
    :style="{ backgroundColor }"
  >
    <div :style="{ fontSize }">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'ui-icon-text',

  props: {
    value: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      backgroundColor: null,
    };
  },

  mounted() {
    this.backgroundColor = window.getComputedStyle(this.$el).color;
  },

  computed: {
    // fontSize depending on string length
    fontSize() {
      if (this.value.length <= 1) {
        return '0.6em';
      } else if (this.value.length <= 2) {
        return '0.5em';
      } else if (this.value.length <= 3) {
        return '0.4em';
      } else {
        return '0.2em';
      }
    },
  },
};
</script>

<style lang="scss">
.ui-icon-text {
  width: 1em;
  height: 1em;
  border-radius: 50%;

  white-space: nowrap;
  overflow: hidden;
  display: flex;

  & > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    color: #fff;
  }
}
</style>