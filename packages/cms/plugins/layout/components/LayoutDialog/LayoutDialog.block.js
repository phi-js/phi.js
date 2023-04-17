import { UiDialog, UiForm } from '../../../../../ui/components'
import LayoutDialogEditor from './LayoutDialogEditor.vue'

export default {
  name: 'LayoutDialog',
  title: 'Dialog',
  icon: 'mdi:dock-window',

  block: {
    component: UiDialog,
    props: { open: false, showCloseButton: true },
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
    component: LayoutDialogEditor,

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