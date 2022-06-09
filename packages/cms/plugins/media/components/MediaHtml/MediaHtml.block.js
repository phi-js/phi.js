import MediaHtml from './MediaHtml.vue'
import MediaHtmlBlockEditor from './MediaHtmlBlockEditor.vue'

export default {
  title: 'Texto',
  icon: 'mdi:text',

  block: {
    component: MediaHtml,
    props: { value: '' },
  },

  editor: { component: MediaHtmlBlockEditor },

  staging: false, // Create immediately.  Do not create a "staging" (accept/cancel) preview block

  // Focus editor when a new block is created
  onCreated(editorRef) {
    if (editorRef?.focus) {
      editorRef.focus()
    }
  },
}