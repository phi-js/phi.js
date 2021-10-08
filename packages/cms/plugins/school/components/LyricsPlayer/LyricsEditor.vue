<template>
  <div class="lyrics-editor">
    <textarea
      style="display: block; width: 100%; height: 16em"
      v-model="input"
    ></textarea>
    <button
      type="button"
      @click="generateOutput"
    >Continuar</button>

    <template v-if="output">
      <input
        type="text"
        placeholder="Focus me, space to tap"
        @keydown.space.prevent="onTap"
      />

      <div class="text-container">
        <div
          v-for="(line,i) in output.lines"
          :key="i"
          :class="[
            'line',
            {
              '--active': currentWord && currentWord.line == i,
              '--past': currentWord && i < currentWord.line,
              '--future': !currentWord || currentWord.line < i
            }
          ]"
        >
          <span
            v-for="(word,k) in line.words"
            :key="k"
            v-text="word.value"
            :class="[
              'word',
              {
                '--active': currentWord && currentWord.line == i && currentWord.word == k,
                '--past': currentWord && currentWord.line == i && k < currentWord.word,
                '--future': !currentWord || (currentWord.line == i && k > currentWord.word)
              }
            ]"
          ></span>
        </div>
      </div>

      <textarea
        :value="JSON.stringify(output, null, 2)"
        style="display: block; width: 100%; height: 16em"
      ></textarea>
    </template>
  </div>
</template>

<script>
export default {
  name: 'LyricsEditor',

  props: {
    url: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      startTime: null,
      pointer: null,

      output: null,
      input: '',
    };
  },

  computed: {
    words() {
      if (this.output === null) {
        return [];
      }

      let retval = [];
      this.output.lines.forEach((line, l) => {
        line.words.forEach((word, w) => {
          retval.push({
            timestamp: word.timestamp,
            class: word.class,
            value: word.value,
            line: l,
            word: w,
          });
        });
      });

      return retval;
    },

    currentWord() {
      if (this.pointer === null) {
        return null;
      }

      return this.words[this.pointer];
    },
  },

  methods: {
    generateOutput() {
      this.output = {
        title: 'Titulo',
        artist: 'Artist',
        url: this.url,
        lines: [],
      };

      let lines = this.input.replace(/\r/g, '').split(/\n/);

      lines.forEach((line) => {
        let words = [];
        let rawWords = line.split(' ');
        rawWords.forEach((word, i) => {
          let parts = word.split('+');
          if (i < rawWords.length - 1) {
            parts[parts.length - 1] += ' ';
          }

          parts.forEach((part) => {
            if (!part.trim()) {
              return;
            }

            words.push({
              timestamp: null,
              class: '',
              value: part,
            });
          });
        });

        this.output.lines.push({
          class: '',
          words,
        });
      });
    },

    start(offset = 0) {
      this.startTime = Date.now() - offset;
      this.pointer = 0;

      this.$el.querySelector('input').focus();
    },

    onTap() {
      if (this.startTime === null) {
        console.log('Not started');
        return;
      }

      let timestamp = Date.now() - this.startTime;

      if (this.pointer <= this.words.length - 1) {
        let line = this.words[this.pointer].line;
        let word = this.words[this.pointer].word;
        this.output.lines[line].words[word].timestamp = timestamp;
      }

      this.pointer++;
    },
  },
};
</script>



<style lang="scss">
.lyrics-editor {
  .text-container {
    font-size: 1.4em;
    font-family: var(--ui-font-secondary);
    font-weight: 500;

    .line {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      min-height: 1em;

      &.--active {
        border: 1px solid red;
      }

      &.--past {
        // display: none;
      }

      &.--future {
        // display: none;
      }
    }

    .word {
      display: block;
      white-space: pre;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);

      border: 1px dotted var(--ui-color-primary);

      transition: all var(--ui-duration-quick);
      transform: scale(1);

      &.--active {
        color: var(--ui-color-warning);
      }

      &.--past {
        color: var(--ui-color-primary);
      }

      &.--future {
        opacity: 0.5;
      }
    }
  }
}
</style>