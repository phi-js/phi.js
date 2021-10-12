const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

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
    face: { component: InputEditor },
    actions: [
      {
        'title': 'Button',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}