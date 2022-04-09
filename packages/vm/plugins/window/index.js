import WindowDialogEditor from './WindowDialogEditor.vue'

export default {
  text: 'Window and Console functions',
  subtext: 'alert, prompt, confirm',

  functions: {
    'console.log': {
      tabs: ['browser'],
      icon: 'mdi:window-maximize',
      text: 'console.log',
      editor: { component: WindowDialogEditor },

      callback: function(args) {
        return console.log(
          '%c[phi]',
          'background: blue; color: #bada55',
          args,
        )
      },
    },

    'window.alert': {
      tabs: ['browser'],
      icon: 'mdi:window-maximize',
      text: 'Alert',
      editor: { component: WindowDialogEditor },

      callback: function(args) {
        if (args && typeof args.message != 'undefined') {
          args = args.message
        }
        return window.alert(args)
      },
    },

    'window.confirm': {
      tabs: ['browser'],
      icon: 'mdi:window-maximize',
      text: 'Confirm',
      editor: { component: WindowDialogEditor },

      callback: function(args) {
        if (args && typeof args.message != 'undefined') {
          args = args.message
        }
        return window.confirm(args)
      },
    },

    'window.prompt': {
      tabs: ['browser'],
      icon: 'mdi:window-maximize',
      text: 'Prompt',
      editor: { component: WindowDialogEditor },

      callback: function({ message, placeholder }) {
        return window.prompt(message, placeholder)
      },
    },
  },
}