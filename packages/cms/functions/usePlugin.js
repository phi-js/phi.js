import vmRegisterPlugin from '@/packages/vm/plugins/registerPlugin.js'

export const addedPlugins = []

/* Built-in plugins */
import pluginLayout from '../plugins/layout'
import pluginMedia from '../plugins/media'
import pluginInput from '../plugins/input'
import pluginNavigation from '../plugins/navigation'
import pluginVideo from '../plugins/video'

// This order is used in PickerContent tabs
usePlugin([
  pluginMedia,
  pluginInput,
  pluginVideo,
  pluginLayout,
  pluginNavigation,
])


export default function usePlugin(plugin) {
  if (Array.isArray(plugin)) {
    plugin.forEach((p) => usePlugin(p))
  } else if (plugin && typeof plugin === 'object') {

    addedPlugins.push(plugin)

    if (plugin.functions) {
      vmRegisterPlugin(plugin)
    }
  }
}