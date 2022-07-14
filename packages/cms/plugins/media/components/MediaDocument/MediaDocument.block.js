import MediaDocument from './MediaDocument.vue'
import MediaDocumentPicker from './MediaDocumentPicker.vue'

export default {
  name: 'MediaDocument',
  title: 'Document',
  icon: 'mdi:file-word',

  block: {
    component: MediaDocument,
    props: {
      value: '',
      provider: 'google',
    },
  },

  editor: {
    face: {
      'component': MediaDocumentPicker,
      'v-model': 'block.props',
      'props': { path: '{{$settings.uploadUrl}}' },
    },
  },
}