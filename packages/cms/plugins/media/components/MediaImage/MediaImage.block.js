import { defineAsyncComponent } from 'vue'
import MediaImage from './MediaImage.vue'

const MediaImageToolbar = defineAsyncComponent(() => import('./MediaImageToolbar.vue'))
const MediaImageFace = defineAsyncComponent(() => import('./MediaImageFace.vue'))
const MediaImageSettings = defineAsyncComponent(() => import('./MediaImageSettings.vue'))

export default {
  name: 'MediaImage',
  title: 'Image',
  icon: 'mdi:image',

  block: {
    component: MediaImage,
    props: { src: '' },
  },

  editor: {
    toolbar: {
      'component': MediaImageToolbar,
      'v-model': 'block.props',
    },

    face: {
      'component': MediaImageFace,
      'v-model': 'block.props',
    },

    actions: [
      {
        id: 'MediaImageSettings',
        title: 'Image settings',
        icon: 'mdi:image',
        component: MediaImageSettings,
        props: { endpoint: '{{ $settings.uploads.assets }}' },
      },
    ],
  },
}