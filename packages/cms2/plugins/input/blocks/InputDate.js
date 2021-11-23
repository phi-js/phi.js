import { UiInput, UiInputEditor } from '../../../../ui/components'
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

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
      'component': UiInputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Fecha',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}