import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  tags: ['input'],

  name: 'InputPassword',
  title: 'Contraseña',
  icon: 'mdi:form-textbox-password',

  block: {
    'component': UiInput,
    'v-model': 'password',
    'props': { type: 'password' },
  },

  editor: {
    face: {
      'component': InputFace,
      'v-model': 'block.props',
    },

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