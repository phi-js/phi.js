const UiVideo = () => import('../../../../../ui/components/UiVideo/UiVideo.vue')
const UiVideoChaptersEditor = () => import('../../../../../ui/components/UiVideo/UiVideoChaptersEditor.vue')
const MediaVideoPicker = () => import('./MediaVideoPicker.vue')

export default {
  "id": "MediaVideo",
  "title": "Video",
  "icon": "mdi:youtube",

  "block": {
    "component": UiVideo,
    "v-model": "video",
    "props": {
      "url": ""
    }
  },

  "editor": {
    "face": {
      "component": MediaVideoPicker,
      "v-model": "block.props.url"
    },

    "actions": [
      {
        "title": "Capítulos",
        "component": UiVideoChaptersEditor,
        "v-model": "block.props.chapters",
        "props": {
          "url": "{{block.props.url}}"
        }
      }
    ]
  }
}