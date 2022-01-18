const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
import InputSettings from '../components/InputSettings/InputSettings.vue'

export default {
  tags: ['input'],

  name: 'InputFile',
  title: 'Archivo',
  icon: 'mdi:paperclip',

  settings: {
    uploadURL: {
      type: String,
      required: true,
    },
  },

  block: {
    'component': UiInput,
    'v-model': 'files',
    'props': {
      type: 'file',
      path: '{{$settings.uploadUrl}}',
    },
  },

  editor: {
    actions: [
      {
        'title': 'Archivo',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}