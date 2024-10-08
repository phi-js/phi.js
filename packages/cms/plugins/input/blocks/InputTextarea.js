import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  name: 'InputTextarea',
  title: 'Textarea',
  icon: 'mdi:form-textarea',

  block: {
    'component': UiInput,
    'v-model': '',
    'props': { type: 'textarea' },
  },

  editor: {
    face: { component: InputFace },

    actions: [
      {
        'id': 'InputSettings',
        'title': 'Field options',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}