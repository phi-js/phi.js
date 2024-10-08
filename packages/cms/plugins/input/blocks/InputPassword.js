import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  name: 'InputPassword',
  title: 'Contraseña',
  icon: 'mdi:form-textbox-password',

  block: {
    'component': UiInput,
    'v-model': '',
    'props': { type: 'password' },
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