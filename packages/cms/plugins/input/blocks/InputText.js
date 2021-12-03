import { UiInput, UiInputEditor } from '/packages/ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'

export default {
  tags: ['input'],

  name: 'InputText',
  title: 'Text',
  icon: 'mdi:form-textbox',

  block: {
    'component': UiInput,
    'v-model': 'text',
    'props': { type: 'text' },
  },

  editor: {
    face: {
      'component': UiInputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Text',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}