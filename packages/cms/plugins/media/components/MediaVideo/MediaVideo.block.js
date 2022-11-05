import UiVideo from '@/packages/ui/components/UiVideo/UiVideo.vue'
import MediaVideoSettings from './MediaVideoSettings.vue'
import MediaVideoData from './MediaVideoData.vue'
import MediaVideoChapters from './MediaVideoChapters.vue'

export default {
  name: 'MediaVideo',
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

      {
        id: 'video-chapters',
        title: 'Chapters',
        component: MediaVideoChapters,
      },

      {
        id: 'video-data',
        title: 'Data',
        icon: 'mdi:code-json',
        component: MediaVideoData,
      },
    ],
  },
}