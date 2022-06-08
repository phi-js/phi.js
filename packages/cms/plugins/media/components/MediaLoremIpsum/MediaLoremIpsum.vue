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
import sourceText from './sourceText.js'

export default {
  name: 'MediaLoremIpsum',

  props: {
    text: {
      type: String,
      default: sourceText,
    },

    nParagraphs: {
      type: [String, Number],
      required: false,
      default: 1,
    },

    nWords: {
      type: [String, Number],
      required: false,
      default: 120,
    },
  },

  computed: {
    words() {
      return this.text.split(' ')
    },

    paragraphs() {
      const nParagraphs = this.validateInt(this.nParagraphs, 1, 50, 1)
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