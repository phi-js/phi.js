const WindowDialogEditor = () => import('./WindowDialogEditor.vue');

export default {
  'window.alert': {
    icon: 'mdi:window-maximize',
    text: 'Alertar',
    secondary: 'window.alert',
    editor: { component: WindowDialogEditor }
  },

  'window.confirm': {
    icon: 'mdi:window-maximize',
    text: 'Pedir confirmación',
    secondary: 'window.confirm',
    editor: { component: WindowDialogEditor }
  },

  'window.prompt': {
    icon: 'mdi:window-maximize',
    text: 'Solicitar dato',
    secondary: 'window.prompt',
    editor: { component: WindowDialogEditor }
  },
}