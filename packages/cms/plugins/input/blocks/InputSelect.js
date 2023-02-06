import { UiInput } from '@/packages/ui/components'
import InputSelectFace from '../components/InputSelectFace.vue'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputSelectSettings from '../components/InputSettings/InputSelectSettings.vue'

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
    face: { component: InputSelectFace },

    actions: [
      {
        'id': 'InputSelectSettings',
        'title': 'Select options',
        'icon': 'mdi:form-dropdown',
        'component': InputSelectSettings,
        'v-model': 'block',
      },
      {
        'id': 'InputSettings',
        'title': 'Labels',
        'icon': 'mdi:text-short',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}