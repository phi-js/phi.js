import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  name: 'InputNumber',
  title: 'Número',
  icon: 'mdi:numeric',

  block: {
    'component': UiInput,
    'v-model': '',
    'props': { type: 'number' },
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