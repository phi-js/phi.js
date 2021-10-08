<template>
  <div class="math-katex"></div>
</template>

<script>
// Lista de ecuaciones con link a .tex descargables
// https://dlmf.nist.gov/

import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: 'math-katex',

  props: {
    value: {
      type: String,
      required: false,
      default: null
    }
  },

  watch: {
    value: {
      handler() {
        this.render();
      }
    }
  },

  mounted() {
    this.render();
  },

  methods: {
    render() {
      if (!this.value) {
        this.$el.innerHTML = '?';
        return;
      }

      katex.render(this.value, this.$el, {
        output: 'html',
        throwOnError: false
      });
    }
  }
};
</script>

<style lang="scss">
.math-katex {
  padding: var(--ui-padding);
}
</style>