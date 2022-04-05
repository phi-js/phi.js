/*
registerPlugin({
  text: 'Window and Console functions',
  subtext: 'alert, prompt, confirm',

  functions: {
    'fnName': {
      icon: 'mdi:window-maximize',
      text: 'Function name',
      editor: { component: WindowDialogEditor }, // vue component

      callback: function(args) {
        // fn code
      },
    },
)
*/

import pluginFetch from './fetch'
import pluginWindow from './window'

export const plugins = []

export default function registerPlugin(objPlugin) {
  plugins.push(objPlugin)
}

// hard-coded default plugins !!!
registerPlugin(pluginFetch)
registerPlugin(pluginWindow)