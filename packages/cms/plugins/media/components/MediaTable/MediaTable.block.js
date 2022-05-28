import { h } from 'vue'
import { UiTable, UiForm, UiItem } from '../../../../../ui/components'

export default {
  name: 'MediaTable',
  title: 'Tabla',
  icon: 'mdi:table',

  block: {
    'component': UiTable,
    'props': {},
    'v-model:data': '',
    'v-model:columns': '',
  },

  emits: [
    {
      event: 'click-row',
      text: 'Row is clicked',
    },
  ],

  editor: {
    face: {
      component: {
        props: {
          modelValue: {
            type: Object,
            required: false,
            default: null,
          },

          openAction: {
            type: Function,
            required: false,
            default: null,
          },
        },
        render() {
          return h(UiItem, {
            icon: 'mdi:table',
            text: 'Tabla',
            subtext: 'Click para editar opciones',
            onClick: () => this.openAction(),
          })
        },
      },
    },

    actions: [
      {
        'title': 'Variables',
        'icon': 'mdi:variable',
        'component': UiForm,
        'v-model': 'block',
        'props': {
          fields: [
            {
              model: 'v-model:data',
              type: 'text',
              label: 'Registros',
            },
            {
              model: 'v-model:columns',
              type: 'text',
              label: 'Columnas',
            },
          ],
        },
      },
    ],
  },
}