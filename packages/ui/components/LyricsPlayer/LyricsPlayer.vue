<template>
  <div class="lyrics-player">
    <!-- <input
      style="display:block; width: 100%"
      type="range"
      v-model="timer"
      min="0"
      max="70000"
    />-->

    <div class="text-container">
      <div
        v-for="line in visibleLines"
        :key="line.key"
        :class="line.class"
      >
        <span
          v-for="(word,k) in line.words"
          :key="k"
          :class="word.class"
          :style="word.style"
          v-text="word.value"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LyricsPlayer',

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      timer: 0,
      timeout: null,
      visibleLines: [],
    }
  },

  computed: {
    words() {
      let transitionDuration = 100
      let classes = this.value.classes || {}
      let retval = []
      this.value.lines.forEach((line, l) => {
        line.words.forEach((word, w) => {
          if (word.timestamp == null) {
            return
          }

          let style = null
          if (word.class) {
            let parts = word.class.split(' ')
            parts.forEach((part) => {
              style = Object.assign({}, style, classes[part])
            })
          }

          retval.push({
            timestamp: word.timestamp - transitionDuration,
            class: word.class,
            value: word.value,
            color: word.color,
            line: l,
            word: w,
            style,
          })
        })
      })

      return retval
    },

    currentWordIndex() {
      return this.words.findIndex((word, i) => {
        let nextWord = i < this.words.length - 1 ? this.words[i + 1] : null
        return nextWord
          ? word.timestamp <= this.timer && this.timer < nextWord.timestamp
          : word.timestamp <= this.timer
      })
    },

    currentWord() {
      return this.currentWordIndex >= 0
        ? this.words[this.currentWordIndex]
        : null
    },
  },

  watch: {
    currentWordIndex() {
      this.computeVisibleLines()
      this.$emit('word', this.currentWord)
    },
  },

  methods: {
    computeVisibleLines() {
      if (!this.currentWord) {
        this.visibleLines = [
          { words: [], key: -1 },
          Object.assign({}, this.value.lines[0], { class: '--future', key: 0 }),
          Object.assign({}, this.value.lines[1], { class: '--future', key: 1 }),
        ]
      }

      let retval = []

      let previousLine =
        this.currentWord.line == 0
          ? { words: [] }
          : this.value.lines[this.currentWord.line - 1]

      previousLine = Object.assign({}, previousLine, {
        class: '--past ' + (previousLine.class || ''),
        key: this.currentWord.line - 1,
      })

      retval.push(previousLine)

      // current line
      let currentLine = {
        key: this.currentWord.line,
        class:
          '--active ' + (this.value.lines[this.currentWord.line].class || ''),

        words: this.value.lines[this.currentWord.line].words.map((word, i) => {
          let copy = Object.assign({}, word)
          copy.class =
            (word.class || '') +
            (this.currentWord.word == i ? ' --active' : '')

          if (this.currentWord.word == i) {
            copy.style = this.currentWord.style
          }

          return copy
        }),
      }
      retval.push(currentLine)

      // next line
      let nextLine =
        this.currentWord.line == this.value.lines.length - 1
          ? { words: [] }
          : this.value.lines[this.currentWord.line + 1]

      nextLine = Object.assign({}, nextLine, {
        key: this.currentWord.line + 1,
        class: '--future ' + (nextLine.class || ''),
      })
      retval.push(nextLine)

      this.visibleLines = retval
    },

    stop() {
      clearTimeout(this.timeout)
      this.timer = 0
    },

    pause() {
      clearTimeout(this.timeout)
    },

    play(time = null) {
      if (time !== null) {
        this.timer = time
      }
      clearTimeout(this.timeout)
      return this.next()
    },

    setTime(time = 0) {
      this.timer = time

      if (this.timeout != null) {
        clearTimeout(this.timeout)
        this.next()
      }
    },

    next() {
      let nextWordIndex = this.currentWordIndex + 1
      if (nextWordIndex >= this.words.length) {
        // console.log('Ya estamos en la ultima palabra');
        return
      }

      let leap = this.words[nextWordIndex].timestamp - this.timer
      this.timeout = setTimeout(() => {
        this.timer = this.words[nextWordIndex].timestamp
        this.next()
      }, leap)
    },
  },
}
</script>

<style lang="scss">
.lyrics-player {
  .text-container {
    font-size: 1.4em;
    font-family: var(--ui-font-secondary);
    font-weight: 500;

    // line
    & > div {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;

      height: 1.4em;
      transition: all 0.1s;

      &.--past {
        opacity: 0.1;
      }

      &.--future {
        opacity: 0.2;
      }
    }

    // word
    & > div > span {
      display: block;
      position: relative;
      top: 0;

      white-space: pre;
      // font-weight: bold;
      color: rgba(0, 0, 0, 0.5);

      transition: all 0.1s;
      transform: scale(1) rotate(0);

      &.--active {
        transform: scale(1.1);
        color: var(--ui-color-primary);
      }

      &.--future {
        opacity: 0.5;
      }
    }
  }
}
</style>