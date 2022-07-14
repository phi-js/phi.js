import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  name: 'InputDate',
  title: 'Fecha',
  icon: 'mdi:calendar',

  block: {
    'component': UiInput,
    'props': { type: 'date' },
    'v-model': '',
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