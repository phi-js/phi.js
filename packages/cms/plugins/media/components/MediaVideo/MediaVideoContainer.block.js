import UiVideoContainer from '@/packages/ui/components/UiVideoContainer/UiVideoContainer.vue'
import MediaVideoContainerFace from './MediaVideoContainerFace.vue'
import MediaVideoSettings from './MediaVideoSettings.vue'
import MediaVideoData from './MediaVideoData.vue'
import MediaVideoChapters from './MediaVideoChapters.vue'

export default {
  name: 'MediaVideoContainer',
  title: 'Video Container',
  icon: 'mdi:youtube',

  block: {
    'component': UiVideoContainer,
    'props': { url: '' },
    'v-model:isPlaying': '',
    'v-model:currentTime': '',
    'v-model:activeChapters': '',
  },

  editor: {
    face: { component: MediaVideoContainerFace },

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