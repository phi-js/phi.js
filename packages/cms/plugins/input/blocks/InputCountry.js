import { UiInput } from '@/packages/ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'


export default {
  name: 'InputCountry',
  title: 'Country',
  icon: 'mdi:flag-variant',

  block: {
    'component': UiInput,
    'v-model': '',
    'props': { type: 'country' },
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