import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  tags: ['input'],

  name: 'InputButton',
  title: 'Button',
  icon: 'mdi:card',

  block: {
    'component': UiInput,
    'v-model': 'button',
    'props': { type: 'button' },
  },

  editor: {
    face: {
      'component': InputFace,
      'v-model': 'block.props',
    },

    actions: [
      {
        'id': 'InputSettings',
        'title': 'Button',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}