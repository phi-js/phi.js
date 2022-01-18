import { UiInput } from '../../../../ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'

export default {
  id: 'CmsInputTimestamp', // Deprecated.  kept only for backwards compatibility

  name: 'InputDate',
  tags: ['input'],
  title: 'Fecha',
  icon: 'mdi:calendar',

  block: {
    component: UiInput,
    props: { type: 'date' },
  },

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