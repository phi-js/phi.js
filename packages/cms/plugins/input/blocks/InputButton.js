import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  tags: ['input'],

  name: 'InputButton',
  title: 'Button',
  icon: 'mdi:card',

  block: {
    component: UiInput,
    props: { type: 'button' },
  },

  emits: [
    {
      event: 'click',
      text: 'The button is clicked',
    },
  ],

  editor: {
    face: { component: InputFace },

    actions: [
      {
        'id': 'InputSettings',
        'title': 'Button options',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}