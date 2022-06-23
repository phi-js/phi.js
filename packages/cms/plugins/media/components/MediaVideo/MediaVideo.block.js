import UiVideo from '@/packages/ui/components/UiVideo/UiVideo.vue'
import MediaVideoSettings from './MediaVideoSettings.vue'

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
    actions: [
      {
        id: 'video',
        title: 'Video settings',
        component: MediaVideoSettings,
        props: { endpoint: '{{ $settings.uploads.assets }}' },
      },
    ],
  },
}