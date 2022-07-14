import vmRegisterPlugin from '@/packages/vm/plugins/registerPlugin.js'

export const addedPlugins = []

export const allBlocks = {} // hashed list of all block definitions.  allBlocks.MediaHtml ...
export const availableBlocks = []

/* Built-in plugins */
import pluginInput from '../plugins/input'
import pluginLayout from '../plugins/layout'
import pluginMedia from '../plugins/media'
import pluginNavigation from '../plugins/navigation'
import pluginVideo from '../plugins/video'

// This order is used in PickerContents
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

    if (Array.isArray(plugin.blocks)) {
      plugin.blocks.forEach((blockDef) => registerDefinition(blockDef))

      // Merge into availableBocks tree
      plugin.blocks.forEach((pluginBlock) => {
        const found = availableBlocks.find((b) => b.title == pluginBlock.title)
        if (found) {
          if (found.children && pluginBlock.children) {
            // found.children.push(...pluginBlock.children)
            found.children.push(...pluginBlock.children.filter((c) => !c.private))
          }
        } else {
          availableBlocks.push(pluginBlock)
        }
      })

      // Sort by block.order property
      availableBlocks.forEach((block, index) => {
        if (typeof block.order !== 'undefined') {
          block.sortOrder = parseInt(block.order) || 0
        } else {
          block.sortOrder = index
        }
      })
      availableBlocks.sort((a, b) => a.sortOrder - b.sortOrder)
    }
  }
}

function registerDefinition(definition) {
  if (!definition || typeof definition != 'object') {
    return
  }

  if (definition.children?.length) {
    definition.children.forEach((child) => registerDefinition(child))
  }

  if (definition.block) {
    allBlocks[definition.name] = definition
  }
}