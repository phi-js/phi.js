import UiVideo from '../../../../../ui/components/UiVideo/UiVideo.vue'
import UiVideoChaptersEditor from '../../../../../ui/components/UiVideo/UiVideoChaptersEditor.vue'
import MediaVideoPicker from './MediaVideoPicker.vue'

export default {
  tags: ['video'],

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