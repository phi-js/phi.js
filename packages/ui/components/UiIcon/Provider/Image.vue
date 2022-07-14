<template>
  <div
    class="UiIcon__image"
    :style="styles"
  />
</template>

<script>
export default {
  name: 'UiIconImage',

  props: {
    fullValue: {
      type: String,
      required: true,
    },
  },

  computed: {
    styles() {
      let src = this.fullValue

      return {
        display: 'block',

        minWidth: '1em',
        minHeight: '1em',
        width: '100%',
        height: '100%',

        backgroundImage: `url('${src}')`,
        backgroundSize: 'cover',
      }
    },
  },
}
</script>
