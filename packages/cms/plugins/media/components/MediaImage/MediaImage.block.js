import { defineAsyncComponent } from 'vue'
import MediaImage from './MediaImage.vue'

const MediaImageToolbar = defineAsyncComponent(() => import('./MediaImageToolbar.vue'))
const MediaImageSettings = defineAsyncComponent(() => import('./MediaImageSettings.vue'))

export default {
  name: 'MediaImage',
  title: 'Image',
  icon: 'mdi:image',

  block: {
    component: MediaImage,
    props: {
      src: '',
      align: 'center',
    },
  },

  editor: {
    toolbar: {
      'component': MediaImageToolbar,
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