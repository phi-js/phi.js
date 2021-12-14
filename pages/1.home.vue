<script setup>
import { ref } from 'vue'
import { CmsStoryEditor } from '/packages/cms'

const defaultStory = {
  pages: [
    {
      component: 'LayoutPage',
      slot: [
        {
          component: 'LayoutRow',
          props: { style: { textAlign: 'center' } },
          slot: [
            {
              component: 'LayoutColumn',
              slot: [
                {
                  component: 'MediaImage',
                  props: {
                    alt: 'Phi.js',
                    title: 'Hello world!',
                    src: '/phi.png',
                  },
                },
                {
                  component: 'MediaHtml',
                  props: { value: '<h1>Phi.js</h1>' },
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

</script>

<template>
  <CmsStoryEditor
    v-model:story="story"
    @update:story="saveStory()"
  />
</template>