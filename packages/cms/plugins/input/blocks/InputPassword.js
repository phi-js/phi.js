import { UiInput, UiInputEditor } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'

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
      'component': UiInputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Contraseña',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}