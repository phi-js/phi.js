const UiVideo = () => import('../../../../../ui/components/UiVideo/UiVideo.vue')
const UiVideoChaptersEditor = () => import('../../../../../ui/components/UiVideo/UiVideoChaptersEditor.vue')
const MediaVideoPicker = () => import('./MediaVideoPicker.vue')

export default {
  id: 'MediaVideo',
  title: 'Video',
  icon: 'mdi:youtube',

  block: {
    'component': UiVideo,
    'props': { url: '' },
    'v-model': 'video',
    'v-model:activeChapters': '',
  },

  editor: {
    face: {
      'component': MediaVideoPicker,
      'v-model': 'block.props.url',
      'props': { endpoint: '{{ $settings.uploads.endpoint }}' },
    },

    actions: [
      {
        'title': 'Capítulos',
        'component': UiVideoChaptersEditor,
        'v-model': 'block.props.chapters',
        'props': { url: '{{block.props.url}}' },
      },
    ],
  },
}