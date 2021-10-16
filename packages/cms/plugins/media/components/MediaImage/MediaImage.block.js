import { UiForm } from '/packages/ui/components'

const MediaImage = () => import('./MediaImage.vue')
const MediaImagePicker = () => import('./MediaImagePicker.vue')

export default {
  name: 'MediaImage',
  title: 'Imagen',
  icon: 'mdi:image',

  block: {
    component: MediaImage,
    props: { src: '' },
  },

  editor: {
    face: {
      'component': MediaImagePicker,
      'v-model': 'block.props.src',
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