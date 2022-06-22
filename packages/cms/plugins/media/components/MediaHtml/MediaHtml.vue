<template>
  <div
    class="MediaHtml story-html"
    v-html="value"
  />
</template>

<script>
export default {
  name: 'MediaHtml',
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
  },
}
</script>

<style lang="scss">
.MediaHtml {
  word-break: break-word;
}
</style>