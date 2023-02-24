<script setup>
import { ref } from 'vue'
import { CmsStoryBuilder, provideStorySettings } from '@/packages/cms'
import useLocationHashPage from '@/packages/cms/functions/useLocationHashPage.js'
// import savedStory from './home.json'

const currentPageId = useLocationHashPage()

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

const settings = { allowSource: true }

provideStorySettings({ uploads: { assets: 'http://v4.local/1/cms/pages/test/files' } })

function reset() {
  if (!confirm('Reset story?')) {
    return
  }

  story.value = defaultStory
  saveStory()
}

const modelValue = ref({
  entry: {
    id: 'ID_DEL_ENTRY_1',
    type: 'mensaje',
    data: { foo: 'foo' },
  },
})
</script>

<template>
  <CmsStoryBuilder
    v-model:story="story"
    v-model:currentPageId="currentPageId"
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