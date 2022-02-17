import WindowDialogEditor from './WindowDialogEditor.vue'

export default {
  'window.alert': {
    icon: 'mdi:window-maximize',
    text: 'Alert',
    editor: { component: WindowDialogEditor },
  },

  'window.confirm': {
    icon: 'mdi:window-maximize',
    text: 'Confirm',
    editor: { component: WindowDialogEditor },
  },

  'window.prompt': {
    icon: 'mdi:window-maximize',
    text: 'Prompt',
    editor: { component: WindowDialogEditor },
  },
}