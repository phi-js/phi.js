<script setup>
import { computed } from '@vue/reactivity'
import { ref } from 'vue'
import UiVideoContainer from './UiVideoContainer.vue'

const chapters = ref([
  {
    name: 'Intro',
    start: 0,
    end: 9000,
  },
  {
    name: 'Menu',
    start: 7000,
    end: 35000,
  },
  {
    name: 'Waiting',
    start: 17000,
    end: 34000,
    pauseOnEnter: false,
    jumpTo: 17000,
  },

  {
    name: 'Cosa 1',
    start: 36000,
    end: 41000,
    seleccionable: true,
    jumpTo: 17000,
  },
  {
    name: 'Cosa 2',
    start: 42000,
    end: 48000,
    seleccionable: true,
    jumpTo: 17000,
  },
  {
    name: 'Cosa 3',
    start: 49000,
    end: 54000,
    seleccionable: true,
    jumpTo: 17000,
  },
])

const activeChapters = ref([])
const currentTime = ref(0)

function playChapter(chapter) {
  console.log('Playing chapter', chapter)
  currentTime.value = chapter.start
}

const isMenuVisible = computed(() => activeChapters.value.includes('Menu'))

const visibleChapters = computed(() => chapters.value.filter((c) => c.seleccionable))

</script>

<template>
  <div class="UiVideoContainer-docs">
    <h1>UiVideoContainer</h1>
    <p>Places as video as a bakcground for the given slot</p>

    <UiVideoContainer
      v-model:activeChapters="activeChapters"
      v-model:current-time="currentTime"
      class="myVideoThing"
      url="https://www.youtube.com/watch?v=BmGu4yNiet0"
      :chapters="chapters"
    >
      <template v-if="isMenuVisible">
        <div
          v-for="chapter in visibleChapters"
          :key="chapter.name"
          class="myVideoThing__overlay"
          @click="playChapter(chapter)"
        >
          {{ chapter.name }}
        </div>
      </template>
    </UiVideoContainer>
  </div>
</template>

<style lang="scss">
.myVideoThing {
  height: 800px;

  &__overlay {
    width: 400px;
    margin: 20px auto;

    padding: 24px;
    background-color: rgba(255,255,255, 0.7);
    border-radius: 10px;

    font-size: 1.2rem;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.39) 0px 10px 20px, rgba(0, 0, 0, 0.53) 0px 6px 6px;

    cursor: pointer;
    &:hover {
      background-color: rgba(255,255,255, 1);
    }
  }
}
</style>