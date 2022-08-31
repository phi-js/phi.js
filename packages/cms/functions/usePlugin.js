import { computed } from 'vue'
import vmRegisterPlugin from '@/packages/vm/plugins/registerPlugin.js'
import { useI18n } from '@/packages/i18n'

export const addedPlugins = []

export const allBlocks = {} // hashed list of all block definitions.  allBlocks.MediaHtml ...
export const availableBlocks = []

/* Built-in plugins */
import pluginData from '../plugins/data'
import pluginInput from '../plugins/input'
import pluginLayout from '../plugins/layout'
import pluginMedia from '../plugins/media'
import pluginNavigation from '../plugins/navigation'
import pluginVideo from '../plugins/video'

// This order is used in PickerContents
usePlugin([
  pluginMedia,
  pluginInput,
  pluginLayout,
  pluginData,
  pluginVideo,
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


/* Available blocks, with translated texts */
export function useAvailableBlocks() {
  let dictionary = {}
  addedPlugins.forEach((plugin) => {
    if (plugin.i18n) {
      dictionary = deepMerge(dictionary, plugin.i18n)
    }
  })
  const i18n = useI18n(dictionary)

  return computed(() => availableBlocks.map((b) => translateBlock(b, i18n)))
}

function translateBlock(block, i18n) {
  return {
    ...block,

    title: block.name
      ? i18n.t(`plugin.component.${block.name}.title`, null, block.title)
      : i18n.t(`plugin.title.${block.title}`, null, block.title),

    description: block.name
      ? i18n.t(`plugin.component.${block.name}.description`, null, '')
      : block.description,

    children: Array.isArray(block.children)
      ? block.children.map((c) => translateBlock(c, i18n))
      : undefined,
  }
}

function deepMerge(obj1, obj2) {
  if (obj1 === null || typeof obj1 != 'object') {
    return obj2 || obj1
  }

  let retval = { ...obj2 }
  for (let prop in obj1) {
    retval[prop] = deepMerge(obj1[prop], obj2?.[prop])
  }
  return retval
}
