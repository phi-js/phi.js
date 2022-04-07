import { UiInput } from '@/packages/ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'


export default {
  tags: ['input'],

  name: 'InputText',
  title: 'Text',
  icon: 'mdi:form-textbox',

  block: {
    'component': UiInput,
    'v-model': '',
    'props': { type: 'text' },
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