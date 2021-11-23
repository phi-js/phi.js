import { UiForm } from '/packages/ui/components'

const MediaImage = () => import('./MediaImage.vue')
const MediaImageToolbar = () => import('./MediaImageToolbar.vue')
const MediaImageEditor = () => import('./MediaImageEditor.vue')

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