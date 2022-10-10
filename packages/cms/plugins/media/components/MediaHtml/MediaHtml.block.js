import { defineAsyncComponent } from 'vue'
import MediaHtml from './MediaHtml.vue'
const MediaHtmlBlockEditor = defineAsyncComponent(() => import('./MediaHtmlBlockEditor.vue'))

export default {
  name: 'MediaHtml',
  title: 'Text',
  icon: 'mdi:text',

  block: {
    component: MediaHtml,
    props: { value: '' },
  },

  editor: { component: MediaHtmlBlockEditor },

  staging: false, // Create immediately.  Do not create a "staging" (accept/cancel) preview block

  // Focus editor when a new block is created
  onCreated(newBlock, refEditor) {
    refEditor?.focus?.()
  },
}