import { UiForm } from '/packages/ui/components'

import MediaImage from './MediaImage.vue'
import MediaImageToolbar from './MediaImageToolbar.vue'
import MediaImageEditor from './MediaImageEditor.vue'

export default {
  name: 'MediaImage',
  title: 'Imagen',
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
      'component': MediaImageEditor,
      'v-model': 'block.props',
      'props': { endpoint: '{{ $settings.uploads.endpoint }}' },
    },

    actions: [
      {
        'title': 'URL',
        'component': UiForm,
        'v-model': 'block.props',
        'props': {
          fields: [
            {
              model: 'src',
              type: 'url',
              label: 'URL de la imágen',
              endpoint: '{{ $settings.uploads.endpoint }}',
            },
            { model: 'href', type: 'text', label: 'Vínculo', props: { placeholder: 'http://' } },
          ],
        },
      },
    ],
  },
}