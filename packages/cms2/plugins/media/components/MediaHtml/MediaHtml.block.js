import { defineAsyncComponent } from 'vue'
const MediaHtml = () => import('./MediaHtml.vue')
const MediaHtmlBlockEditor = () => import('./MediaHtmlBlockEditor.vue')

export default {
  title: 'Texto',
  icon: 'mdi:text',

  block: {
    component: MediaHtml,
    props: { value: '' },
  },

  editor: { component: defineAsyncComponent(MediaHtmlBlockEditor) },
}