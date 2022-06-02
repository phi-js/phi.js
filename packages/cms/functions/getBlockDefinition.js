import { addedPlugins } from './usePlugin.js'

export default function getBlockDefinition(block) {
  if (!block?.component) {
    return null
  }

  for (let i = 0; i < addedPlugins.length; i++) {
    if (addedPlugins[i].blocks?.[block.component]) {
      return addedPlugins[i].blocks?.[block.component]
    }
  }

  return null
}