<template>
  <div class="ui-icon-image" :style="styles"></div>
</template>

<script>
export default {
  name: 'UiIconImage',

  props: {
    fullValue: {
      type: String,
      required: true
    }
  },

  computed: {
    styles() {
      let src = this.fullValue

      return {
        display: 'inline-block',

        width: '1em',
        height: '1em',
        backgroundImage: `url('${src}')`,
        backgroundSize: 'cover'
      }
    }
  }
}
</script>
