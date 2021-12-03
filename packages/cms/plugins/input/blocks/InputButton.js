import { UiInput, UiInputEditor } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'

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
      'component': UiInputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Button',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}