<script setup>
/*
The lyrics player receives "lines" array and a "currentTime" number (in milliseconds)
and adds classes --active, --past --present to the lines and words, according to the currentTime
*/
import { computed } from 'vue'

const props = defineProps({
  lines: {
    type: Array,
    required: true,
  },

  currentTime: {
    type: [String, Number],
    required: false,
    default: 0
  }
})

const allWords = []
props.lines.forEach((line, l) => {
  line.words.forEach((word, w) => {
    if (word.timestamp == null) {
      return
    }

    allWords.push({
      timestamp: word.timestamp - 100, // offset for transition duration (100ms)
      class: word.class,
      value: word.value,
      lineIndex: l,
      wordIndex: w
    })
  })
})

const currentWord = computed(() => allWords.find((word, i) => {
  const nextWordTime = allWords[i + 1]?.timestamp || Infinity
  return word.timestamp <= props.currentTime && props.currentTime < nextWordTime
}))
</script>

<template>
  <div class="LyricsPlayer ui--noselect">
    <div
      v-for="(line, l) in props.lines"
      :key="l"
      class="LyricsPlayer__line"
      :class="{
        'LyricsPlayer__line--active': l == currentWord?.lineIndex,
        'LyricsPlayer__line--past': l < currentWord?.lineIndex,
        'LyricsPlayer__line--future': !currentWord || l > currentWord?.lineIndex,
      }"
    >
      <span
        class="LyricsPlayer__word"
        v-for="(word, k) in line.words"
        :key="k"
        :class="currentWord?.lineIndex == l && currentWord?.wordIndex == k ? ['LyricsPlayer__word--active', word.class] : null"
        v-text="word.value"
      />
    </div>
  </div>
</template>

<style lang="scss">
.LyricsPlayer {
  font-size: 1.4em;
  font-family: var(--ui-font-secondary);
  font-weight: 500;

  &__line {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    text-align: center;

    height: 1.4em;
    transition: all 0.1s ease;
    transform: scale(1);

    overflow: hidden;

    &--past {
      height: 0;
    }

    &--future {
      opacity: 0.2;
      height: 0;
    }

    // Initial line
    &--future:first-child {
      height: 1.4em;
    }

    // incoming line
    &--active + &--future {
      height: 1.4em;
      transform: scale(0.7);
    }

    // // incoming line + 2
    // &--active + &--future + &--future {
    //   height: 1.4em;
    //   transform: scale(0.5);
    // }
  }

  &__word {
    white-space: pre;
    color: rgba(0, 0, 0, 0.6);

    transition: all 0.1s ease;
    transform: scale(1) rotate(0);

    &--active {
      transform: scale(1.1);
      color: var(--ui-color-primary);
    }
  }
}
</style>