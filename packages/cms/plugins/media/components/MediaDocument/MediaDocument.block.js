import MediaDocument from './MediaDocument.vue'
import MediaDocumentPicker from './MediaDocumentPicker.vue'

export default {
  name: 'MediaDocument',
  title: 'Documento embebido',
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