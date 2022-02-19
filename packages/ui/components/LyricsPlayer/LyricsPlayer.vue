<script setup>
/*
The lyrics player receives "lyrics" object (must have a .lines array) and a "currentTime" number (in milliseconds)
and adds classes --active, --past --present to the lines and words according to the currentTime
*/
import { ref, computed, watch } from 'vue'

const props = defineProps({
  lyrics: {
    type: Object,
    required: true,
  },

  currentTime: {
    type: [String, Number],
    required: false,
    default: 0
  }
})

const emit = defineEmits(['wordEnter'])

const allLines = props.lyrics.lines.filter(line => line?.words?.length > 0)

const allWords = []
allLines.forEach((line, l) => {
  line.words.forEach((word, w) => {
    if (word.timestamp == null) {
      return
    }

    // If the block has a "class" attribute that is declared in lyrics.classes,
    // copy the lyrics.classes definition into a prop to be assigned as "style" when the word is active
    let activeStyle = {}
    if (word.class) {
      const parts = word.class.split(' ')
      parts.forEach(part => Object.assign(activeStyle, props.lyrics?.classes?.[part]))
    }

    allWords.push({
      timestamp: word.timestamp - 100, // offset for transition duration (100ms)
      class: word.class,
      value: word.value,
      lineIndex: l,
      wordIndex: w,
      original: word,
      activeStyle
    })
  })
})

// video players emit currentTime every 250ms or so.
// simulate bursts to update more frequently:
const currentTime = ref(props.currentTime)
let timer = null
const burst = 75

watch(
  () => props.currentTime,
  (newCurrentTime) => {
    clearTimeout(timer)
    currentTime.value = newCurrentTime
    timer = setTimeout(() => {
      currentTime.value += burst
      timer = setTimeout(() => currentTime.value += burst, burst)
    }, burst)
  }
)

const currentWord = computed(() => allWords.find((word, i) => {
  const nextWordTime = allWords[i + 1]?.timestamp || Infinity
  return word.timestamp <= currentTime.value && currentTime.value < nextWordTime
}))

watch(currentWord, () => currentWord.value && emit('wordEnter', currentWord.value.original))
</script>

<template>
  <div class="LyricsPlayer ui--noselect">
    <div
      v-for="(line, l) in allLines"
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
        :style="currentWord?.lineIndex == l && currentWord?.wordIndex == k ? currentWord.activeStyle : null"
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

    &--past {
      overflow: hidden;
      height: 0;
    }

    &--future {
      overflow: hidden;
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