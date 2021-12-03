import WindowDialogEditor from './WindowDialogEditor.vue'

export default {
  'window.alert': {
    icon: 'mdi:window-maximize',
    text: 'window.alert',
    editor: { component: WindowDialogEditor },
  },

  'window.confirm': {
    icon: 'mdi:window-maximize',
    text: 'window.confirm',
    editor: { component: WindowDialogEditor },
  },

  'window.prompt': {
    icon: 'mdi:window-maximize',
    text: 'window.prompt',
    editor: { component: WindowDialogEditor },
  },
}