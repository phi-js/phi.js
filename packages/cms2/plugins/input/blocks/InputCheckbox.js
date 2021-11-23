import { UiInput, UiInputEditor } from '../../../../ui/components'
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

export default {
  tags: ['input'],

  name: 'InputCheckbox',
  title: 'Checkbox',
  icon: 'mdi:checkbox-blank-outline',

  block: {
    'component': UiInput,
    'v-model': 'check',
    'props': { type: 'checkbox' },
  },

  editor: {
    face: {
      'component': UiInputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Checkbox',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}