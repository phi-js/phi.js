<script setup>
import { ref } from 'vue'
import { CmsStoryBuilder } from '@/packages/cms'
// import { CmsStory as CmsStoryBuilder } from '@/packages/cms'
// import savedStory from './home.json'

const defaultStory = {
  id: 'story-test-1',
  pages: [
    {
      id: 'p1',
      component: 'LayoutPage',
      slots: {
        default: [
          {
            component: 'MediaImage',
            props: {
              alt: 'Phi.js',
              title: 'Hello world!',
              src: '/phi.svg',
              align: 'center',
            },
          },
          {
            component: 'MediaHtml',
            props: { value: '<h1 style="text-align: center">Phi<em>.js</em></h1>' },
          },
          {
            component: 'MediaLoremIpsum',
            props: { nParagraphs: 3 },
          },
        ],
      },
    },
  ],
}

const savedStory = JSON.parse(localStorage.getItem('phijs:home'))

const story = ref(savedStory || defaultStory)

function saveStory() {
  localStorage.setItem('phijs:home', JSON.stringify(story.value))
}

const settings = ref({
  allowSource: true,
  uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' },
})

function reset() {
  if (!confirm('Reset story?')) {
    return
  }

  story.value = defaultStory
  saveStory()
}

const modelValue = ref({})
</script>

<template>
  <CmsStoryBuilder
    v-model:story="story"
    v-model="modelValue"
    :settings="settings"
    @update:story="saveStory()"
  />

  <button
    type="button"
    style="display: block; margin-left: auto"
    @click="reset()"
  >
    Reset
  </button>
</template>