import { defineAsyncComponent } from 'vue'
const UiInput = defineAsyncComponent(() =>
  import('../../../../ui/components/UiInput/UiInput.vue')
    .then((mod) => mod.default))

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
    'v-model': '',
    'props': {
      type: 'upload',
      endpoint: '{{$settings.uploads.endpoint}}',
      inline: false,
      multiple: false,
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