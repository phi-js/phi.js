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

export default Cms
export { blocks }