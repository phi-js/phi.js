import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  tags: ['input'],

  name: 'InputCheckbox',
  title: 'Checkbox',
  icon: 'mdi:checkbox-blank-outline',

  block: {
    'component': UiInput,
    'v-model': '',
    'props': { type: 'checkbox' },
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