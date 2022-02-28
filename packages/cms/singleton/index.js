const blocks = {}

const Cms = {
  plugin(pluginObject) {
    Object.assign(blocks, pluginObject.blocks)
  },

  async getDefinition(block) {
    if (!block?.component) {
      return null
    }
    return blocks?.[block.component]
  },
}

import pluginLayout from '../plugins/layout'
Cms.plugin(pluginLayout)

import pluginMedia from '../plugins/media'
Cms.plugin(pluginMedia)

import pluginInput from '../plugins/input'
Cms.plugin(pluginInput)

import pluginNavigation from '../plugins/navigation'
Cms.plugin(pluginNavigation)

import pluginVideo from '../plugins/video'
Cms.plugin(pluginVideo)

export default Cms
export { blocks }