<script setup>
import { ref } from 'vue'
import { CmsStoryEditor, CmsStory } from '@/packages/cms'
import { UiTabs, UiTab } from '@/packages/ui'

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
const currentTab = ref('editor')

function onDraft(foo) {
  console.log('draft!', foo)
}
</script>

<template>
  <UiTabs v-model="currentTab">
    <UiTab text="Editor" value="editor">
      <CmsStoryEditor
        v-model:story="story"
        :settings="settings"
        @update:story="saveStory()"
        @update:draft="onDraft"
      />
      <footer style="text-align: right">
        <button type="button" @click="reset()">Reset</button>
      </footer>
    </UiTab>

    <UiTab text="Preview" value="preview">
      <CmsStory v-model="modelValue" :story="story" :settings="settings" />
    </UiTab>
  </UiTabs>
</template>