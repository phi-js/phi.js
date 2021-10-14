import { UiInput, UiInputEditor } from '../../../../ui/components'
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

export default {
  tags: ['input'],

  name: 'InputTextarea',
  title: 'Textarea',
  icon: 'mdi:form-textarea',

  block: {
    'component': UiInput,
    'v-model': 'textarea',
    'props': { type: 'textarea' },
  },

  editor: {
    face: {
      'component': UiInputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Textarea',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}