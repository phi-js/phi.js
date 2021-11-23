import { UiForm } from '/packages/ui/components'

const MediaFile = () => import('./MediaFile.vue')
const MediaFileEditor = () => import('./MediaFileEditor.vue')
const MediaFileLauncher = () => import('./MediaFileLauncher.vue')

export default {
  name: 'MediaFile',
  title: 'Archivo',
  icon: 'mdi:paperclip',
  description: 'Archivo',

  block: {
    component: MediaFile,
    props: {
      href: '',
      text: '',
      secondary: '',
      name: '',
      size: '',
      mimetype: '',
    },
  },

  editor: {
    launcher: {
      component: MediaFileLauncher,
      props: { path: '{{$settings.uploadUrl}}' },
    },

    face: {
      'component': MediaFileEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Detalles',
        'component': UiForm,
        'v-model': 'block',
        'props': {
          fields: [
            {
              type: 'text',
              label: 'Título',
              model: 'props.text',
            },
            {
              type: 'text',
              label: 'Descripción',
              model: 'props.secondary',
            },
            {
              type: 'static',
              label: 'Nombre',
              model: 'props.name',
            },
            {
              type: 'static',
              label: 'Tamaño',
              model: 'props.size',
            },
            {
              type: 'static',
              label: 'Tipo',
              model: 'props.mimetype',
            },
          ],

        },
      },
    ],
  },
}