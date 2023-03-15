import MediaImage from './MediaImage.vue'
import MediaImageToolbar from './MediaImageToolbar.vue'
import MediaImageFace from './MediaImageFace.vue'
import MediaImageSettings from './MediaImageSettings.vue'

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