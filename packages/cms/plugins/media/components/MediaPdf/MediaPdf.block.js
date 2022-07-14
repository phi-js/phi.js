import MediaPdf from './MediaPdf.vue'
import MediaPdfEditor from './MediaPdfEditor.vue'

export default {
  name: 'MediaPdf',
  title: 'PDF',
  icon: 'mdi:file-pdf-box',
  description: 'PDF Editor',

  block: { component: MediaPdf },

  editor: {
    face: {
      component: MediaPdfEditor,
      // 'v-model': 'block',
    },
  },

  staging: false,
}