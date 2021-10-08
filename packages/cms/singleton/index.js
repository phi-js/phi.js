const blocks = {}
const actions = {}

const Cms = {
  plugin(pluginObject) {
    Object.assign(blocks, pluginObject.blocks)
    Object.assign(actions, pluginObject.actions)
  },

  async getDefinition(block) {
    if (!block?.component) {
      return null
    }

    let definitionId = block.component
    if (typeof blocks[definitionId] != 'undefined') {
      return blocks[definitionId]
    }

    return null

    // // ALIASES
    // let replacements = { CmsMediaDocumentViewer: 'MediaDocument' }

    // if (typeof replacements[definitionId] != 'undefined') {
    //   let alias = replacements[definitionId]
    //   if (typeof blocks[alias] != 'undefined') {
    //     return blocks[alias]
    //   }
    // }

    // // !!! Fallback: Ver si existe un componente SIN el prefijo "Cms"  (i.e.  CmsSomeComponent se busca como SomeComponent)
    // if (definitionId.substr(0, 3) == 'Cms' && typeof blocks[definitionId.substr(3)] != 'undefined') {
    //   return blocks[definitionId.substr(3)]
    // }
  },

  async getActionDefinition(actionName) {
    if (!actionName) {
      return null
    }

    if (typeof actions[actionName] != 'undefined') {
      return actions[actionName]
    }

    return null
  },
}


/* !!! load built-in plugins !!! */
import pluginCode from '../plugins/core'
Cms.plugin(pluginCode)

import pluginMedia from '../plugins/media'
Cms.plugin(pluginMedia)

import pluginInput from '../plugins/input'
Cms.plugin(pluginInput)

// import pluginSchool from '../plugins/school'
// Cms.plugin(pluginSchool)

// import pluginGoogle from '../plugins/google'
// Cms.plugin(pluginGoogle)

export default Cms