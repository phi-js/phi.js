<template>
  <div class="MediaLoremIpsum story-html">
    <p
      v-for="(p,i) in paragraphs"
      :key="i"
      v-text="p"
    />
  </div>
</template>

<script>
export default {
  name: 'MediaLoremIpsum',

  props: {
    text: {
      type: String,
      default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas malesuada habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed. Praesent eu lobortis erat. Sed eros velit, laoreet in hendrerit id, commodo vel velit. Nullam at lorem at mi luctus pulvinar in quis orci. Curabitur eget sollicitudin dolor. Fusce ultricies est nunc, vitae vehicula metus dapibus eu. Donec in velit ac nibh dictum mattis. Duis mollis lectus sed varius dapibus. Suspendisse potenti. Nunc fringilla, dui id vestibulum malesuada, metus massa ultricies metus, sed lacinia ligula tellus sit amet ante. Morbi feugiat in ex vitae scelerisque. Donec accumsan ultrices ex, in faucibus dolor aliquet et.',
    },

    nParagraphs: {
      type: [String, Number],
      required: false,
      default: 3,
    },

    nWords: {
      type: [String, Number],
      required: false,
      default: 150,
    },
  },

  computed: {
    words() {
      return this.text.split(' ')
    },

    paragraphs() {
      const nParagraphs = this.validateInt(this.nParagraphs, 1, 50, 2)
      const nWords = this.validateInt(this.nWords, 10, 800, 120)

      const retval = []
      for (let i = 0; i < nParagraphs; i++) {
        retval.push(this.generateParagraph(nWords))
      }
      return retval
    },
  },

  methods: {
    validateInt(value, min, max, defaultValue) {
      let retval = parseInt(value)
      return Number.isNaN(retval) ? defaultValue : Math.max(min, Math.min(max, retval))
    },

    generateParagraph(len) {
      if (!len) {
        return this.text
      }
      let retval = []
      while (retval.length < len) {
        retval.push(this.words[retval.length % this.words.length])
      }
      return retval.join(' ')
    },
  },
}
</script>