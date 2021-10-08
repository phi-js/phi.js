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

  settings: {
    uploadURL: {
      type: String,
      required: true,
    },
  },

  editor: {
    face: {
      'component': MediaImagePicker,
      'v-model': 'block.props.src',
      'props': { path: '{{$settings.uploadUrl}}' },
    },

    actions: [
      {
        'title': 'URL',
        'component': UiForm,
        'v-model': 'block.props',
        'props': {
          fields: [
            { model: 'src', type: 'text', label: 'URL de la imágen' },
            { model: 'href', type: 'text', label: 'Vínculo', props: { placeholder: 'http://' } },
          ],
        },
      },

      // {
      //   title: "Explorador de archivos",
      //   component: "UrlPicker",
      //   "v-model": "block.props.src",
      //   props: {
      //     path: "{{settings.uploadUrl}}"
      //   }
      // }

    ],
  },
}