<template>
  <div class="math-katex-picker">
    <MathKatex
      :value="value"
      class="ui-clickable"
      @click.native="isOpen = !isOpen"
    />

    <div
      class="editor-body"
      v-show="isOpen || !value"
    >
      <textarea
        class="ui-native"
        style="resize: vertical"
        placeholder="Fórmula (formato LaTeX)"
        :value="value"
        @input="onTextInput($event.target.value)"
      ></textarea>

      <div class="finder">
        <div class="finder-query">
          <input
            class="ui-native"
            type="text"
            :value="q"
            @input="q = $event.target.value"
            placeholder="URL de Wikipedia"
          />
          <button
            class="ui-native"
            type="button"
            @click="fetchEquations"
            @blur="results = []"
          >Buscar</button>
        </div>

        <div
          class="results ui-card ui-z"
          v-show="results.length > 0"
        >
          <MathKatex
            class="ui-clickable"
            v-for="(result,i) in results"
            :key="i"
            @mousedown.native="onClickResult(result)"
            :value="result.tex"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useApi } from '../../../../../api';
import MathKatex from './MathKatex.vue';
import apiMath from '../../api/math.js';

export default {
  name: 'MathKatexPicker',
  components: { MathKatex },
  mixins: [useApi],
  $api: apiMath,

  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      q: null,
      results: [],
      isOpen: !!this.value,
    };
  },

  methods: {
    onTextInput(value) {
      this.isOpen = true;
      this.$emit('input', value);
    },

    onClickResult(result) {
      this.$emit('input', result.tex);
      this.results = [];
    },

    async fetchEquations() {
      if (!this.q || !this.q.trim()) {
        return;
      }

      this.results = await this.$api.fetchEquations(this.q);
    },
  },
};
</script>

<style lang="scss">
.math-katex-picker {
  .math-scrim {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    z-index: 2;
  }

  textarea {
    display: block;
    width: 100%;
  }

  .finder {
    margin-top: var(--ui-breathe);
    position: relative;

    .results {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;

      max-height: 500px;
      overflow-y: auto;
      z-index: 2;
    }
  }

  .finder-query {
    display: flex;
    align-items: center;

    & > input {
      flex: 1;
    }
  }
}
</style>