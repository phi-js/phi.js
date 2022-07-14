import { defineAsyncComponent } from 'vue'
const UiInput = defineAsyncComponent(() =>
  import('../../../../ui/components/UiInput/UiInput.vue')
    .then((mod) => mod.default))

import InputSettings from '../components/InputSettings/InputSettings.vue'

export default {
  name: 'InputUpload',
  title: 'Archivo',
  icon: 'mdi:paperclip',

  block: {
    'component': UiInput,
    'v-model': '',
    'props': {
      type: 'upload',
      endpoint: '{{ $settings.uploads.user }}',
      inline: false,
      multiple: false,
      placeholder: 'Upload files',
    },
  },

  editor: {
    actions: [
      {
        'id': 'InputSettings',
        'title': 'Archivo',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}