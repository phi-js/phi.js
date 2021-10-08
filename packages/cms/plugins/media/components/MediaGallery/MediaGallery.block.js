const MediaGallery = () => import('./MediaGallery.vue')
const MediaGalleryEditor = () => import('./MediaGalleryEditor.vue')

export default {
  "name": "MediaGallery",
  "title": "Galería",
  "icon": "mdi:image-multiple",

  "block": {
    "component": MediaGallery,
    "props": {
      "files": [],
      "view": "grid",
      "previewLimit": 4
    }
  },

  "editor": {
    "actions": [
      {
        "title": "Galería",
        "component": MediaGalleryEditor,
        "v-model": "block.props",
        "props": {
          "path": "{{$settings.uploadUrl}}"
        }
      }
    ]
  }
};