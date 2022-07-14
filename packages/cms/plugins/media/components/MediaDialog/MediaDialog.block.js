import { UiDialog, UiForm } from '../../../../../ui/components'
import MediaDialogEditor from './MediaDialogEditor.vue'

export default {
  name: 'MediaDialog',
  title: 'Popup',
  icon: 'mdi:dock-window',

  block: {
    component: UiDialog,
    props: { open: false },
    slot: [],
  },

  emits: [
    {
      event: 'open',
      text: 'The dialog opens',
    },
    {
      event: 'close',
      text: 'The dialog closes',
    },
  ],

  editor: {
    component: MediaDialogEditor,

    actions: [
      {
        'title': 'Variables',
        'icon': 'mdi:variable',
        'component': UiForm,
        'v-model': 'block',
        'props': {
          fields: [
            {
              model: 'props.open',
              type: 'text',
              label: 'props.open',
            },
            // {
            //   model: 'v-model:open',
            //   type: 'text',
            //   label: 'v-model:open',
            // },
          ],
        },
      },
    ],
  },
}