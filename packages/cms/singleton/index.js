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

/* !!! load built-in plugins !!! */
// import pluginCore from '../plugins/core'
// Cms.plugin(pluginCore)

import pluginMedia from '../plugins/media'
Cms.plugin(pluginMedia)

import pluginInput from '../plugins/input'
Cms.plugin(pluginInput)

// import pluginSchool from '../plugins/school'
// Cms.plugin(pluginSchool)

// import pluginGoogle from '../plugins/google'
// Cms.plugin(pluginGoogle)

export default Cms
export { blocks }