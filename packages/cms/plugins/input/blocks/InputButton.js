import InputButton from '../components/InputButton/InputButton.vue'
import InputButtonSettings from '../components/InputButton/InputButtonSettings.vue'

export default {
  name: 'InputButton',
  title: 'Button',
  icon: 'mdi:card',

  block: { component: InputButton },

  emits: [
    {
      event: 'click',
      text: 'The button is clicked',
    },
  ],

  editor: {
    actions: [
      {
        'id': 'InputButtonSettings',
        'title': 'Button options',
        'component': InputButtonSettings,
        'v-model': 'block',
      },
    ],
  },
}