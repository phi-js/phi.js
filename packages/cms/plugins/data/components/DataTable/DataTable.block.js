import { h } from 'vue'
import { UiDataTable, UiForm, UiItem } from '@/packages/ui'

export default {
  name: 'DataTable',
  title: 'Table',
  icon: 'mdi:table',

  block: {
    'component': UiDataTable,
    'props': {},
    'v-model:records': '',
    'v-model:columns': '',
    'v-model:order': '',
  },

  emits: [
    {
      event: 'click-record',
      text: 'Record is clicked',
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
            // subtext: 'Click para editar opciones',
            // onClick: () => this.openAction(),
          })
        },
      },
    },

    actions: [
      {
        'id': 'DataTableVariables',
        'title': 'Variables',
        'icon': 'mdi:variable',
        'component': UiForm,
        'v-model': 'block',
        'props': {
          fields: [
            {
              model: 'v-model:records',
              type: 'text',
              label: 'Registros',
            },
            {
              model: 'v-model:columns',
              type: 'text',
              label: 'Columnas',
            },
            {
              model: 'v-model:order',
              type: 'text',
              label: 'Orden',
            },
          ],
        },
      },
    ],
  },
}