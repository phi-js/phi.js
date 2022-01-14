<script setup>
import { ref } from 'vue'
import { CmsStoryEditor } from '@/packages/cms'

const defaultStory = {
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
                    alt: 'Phi',
                    title: 'Hello world!',
                    src: '/phi.png',
                    align: 'center',
                  },
                },
                {
                  component: 'MediaHtml',
                  props: { value: '<h1 style="text-align: center">Phi</h1>' },
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

</script>

<template>
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
</template>