import { UiInput, UiForm } from '/packages/ui/components'
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')


export default {
  tags: ['input'],

  name: 'InputSelect',
  title: 'Select',
  icon: 'mdi:form-dropdown',

  block: {
    'component': UiInput,
    'v-model': 'select',
    'props': { type: 'select' },
  },

  editor: {
    toolbar: {
      'v-model': 'block',
      'component': UiForm,
      'props': {
        inline: true,
        fields: [
          {
            model: 'props.multiple',
            type: 'select-native',
            options: [
              {
                text: 'Múltiple',
                value: true,
              },
              {
                text: 'Único',
                value: false,
              },
            ],
          },
          // {
          //   "model": "props.native",
          //   "type": "select-native",
          //   "options": [
          //     {
          //       "text": "Lista desplegable",
          //       "value": true
          //     },
          //     {
          //       "text": "Lista con iconos",
          //       "value": false
          //     }
          //   ],
          // }
        ],
      },
    },

    face: {
      'component': InputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Select',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}