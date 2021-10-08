const MediaDocument = () => import('./MediaDocument.vue')
const MediaDocumentPicker = () => import('./MediaDocumentPicker.vue')

export default {
  "name": "MediaDocument",
  "title": "Documento embebido",
  "icon": "mdi:file-word",

  "block": {
    "component": MediaDocument,
    "props": {
      "value": "",
      "provider": "google"
    }
  },

  "editor": {
    "face": {
      "component": MediaDocumentPicker,
      "v-model": "block.props",
      "props": {
        "path": "{{$settings.uploadUrl}}"
      }
    }
  }
}