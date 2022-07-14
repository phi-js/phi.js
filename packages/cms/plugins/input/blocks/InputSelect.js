import { UiInput } from '@/packages/ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  name: 'InputSelect',
  title: 'Select',
  icon: 'mdi:form-dropdown',

  block: {
    'component': UiInput,
    'v-model': '',
    'props': {
      type: 'select-list',
      multiple: false,
    },
  },

  emits: [
    {
      event: 'click',
      text: 'Click on the select box',
    },
    {
      event: 'update:modelValue',
      text: 'Value changes',
    },
  ],

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