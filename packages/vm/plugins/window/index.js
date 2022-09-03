import WindowDialogEditor from './WindowDialogEditor.vue'

export default {
  functions: [
    {
      name: 'window',
      children: [
        {
          name: 'window.alert',
          icon: 'mdi:window-maximize',
          editor: { component: WindowDialogEditor },

          callback: function(args) {
            if (args && typeof args.message != 'undefined') {
              args = args.message
            }
            return window.alert(args)
          },
        },

        {
          name: 'window.confirm',
          icon: 'mdi:window-maximize',
          editor: { component: WindowDialogEditor },

          callback: function(args) {
            if (args && typeof args.message != 'undefined') {
              args = args.message
            }
            return window.confirm(args)
          },
        },

        {
          name: 'window.prompt',
          icon: 'mdi:window-maximize',
          editor: { component: WindowDialogEditor },

          callback: function({ message, placeholder }) {
            return window.prompt(message, placeholder)
          },
        },

        {
          name: 'console.log',
          icon: 'mdi:window-maximize',
          editor: { component: WindowDialogEditor },

          callback: function(args) {
            return console.log(
              '%c[phi]',
              'background: blue; color: #bada55',
              args,
            )
          },
        },
      ],
    },
  ],
}