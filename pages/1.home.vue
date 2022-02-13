<script setup>
import { ref } from 'vue'
import { CmsStoryEditor, CmsStory } from '@/packages/cms'
import { UiInput } from '@/packages/ui/components'
import * as themes from '@/packages/cms/themes'

const defaultStory = {
  id: 'story-test-1',

  pages: [
    {
      component: 'LayoutPage',
      slot: [
        {
          component: 'LayoutRow',
          slot: [
            {
              component: 'LayoutColumn',
              slot: [
                {
                  component: 'MediaImage',
                  props: {
                    alt: 'Phi.js',
                    title: 'Hello world!',
                    src: '/phi.svg',
                    align: 'center',
                    class: 'svgbg',
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
          ],
        },
      ],
    },
  ],
}

const savedStory = JSON.parse(localStorage.getItem('phijs:home'))
const story = ref(savedStory || defaultStory)

function saveStory() {
  localStorage.setItem('phijs:home', JSON.stringify(story.value))
}

const settings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })

function reset() {
  if (!confirm('Reset story?')) {
    return
  }

  story.value = defaultStory
  saveStory()
}

const modelValue = ref({})

function setTheme(theme) {
  story.value.theme = theme || null
  saveStory()
}
</script>

<template>
  <select
    :value="story?.theme?.id"
    @change="setTheme(themes[$event.target.value])"
  >
    <option>Choose theme</option>
    <option
      v-for="(theme,key) in themes"
      :key="key"
      :value="key"
      v-text="theme.text"
    />
  </select>

  <UiInput
    v-model="story.css"
    type="code"
    lang="css"
  />
  <br>
  <br>
  <br>

  <CmsStoryEditor
    v-model:story="story"
    :settings="settings"
    @update:story="saveStory()"
  />
  <footer style="text-align: right">
    <button
      type="button"
      @click="reset()"
    >
      Reset
    </button>
  </footer>

  <CmsStory
    v-model="modelValue"
    :story="story"
    :settings="settings"
  />
</template>