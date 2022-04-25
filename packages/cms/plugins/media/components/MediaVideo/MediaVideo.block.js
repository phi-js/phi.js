import UiVideo from '../../../../../ui/components/UiVideo/UiVideo.vue'
import MediaVideoSettings from './MediaVideoSettings.vue'
import MediaVideoPicker from './MediaVideoPicker.vue'

export default {
  tags: ['video'],

  id: 'MediaVideo',
  title: 'Video',
  icon: 'mdi:youtube',

  block: {
    'component': UiVideo,
    'props': { url: '' },
    'v-model:isPlaying': '',
    'v-model:currentTime': '',
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
        title: 'Video',
        component: MediaVideoSettings,
      },
    ],
  },
}