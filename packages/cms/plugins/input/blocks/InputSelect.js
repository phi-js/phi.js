import { UiInput } from '@/packages/ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  tags: ['input'],

  name: 'InputSelect',
  title: 'Select',
  icon: 'mdi:form-dropdown',

  block: {
    'component': UiInput,
    'v-model': 'select',
    'props': {
      type: 'select',
      multiple: false,
    },
  },

  emits: [
    {
      event: 'click',
      text: 'Click on the select box'
    },
    {
      event: 'change',
      text: 'The picker value changed'
    },
    {
      event: 'foo',
      text: 'Foo happens'
    }
  ],

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