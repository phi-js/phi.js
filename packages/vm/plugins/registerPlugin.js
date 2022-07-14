import pluginFetch from './fetch'
import pluginWindow from './window'

export const plugins = []

// Hashed object of all registered functions registeredFunctions['some.function.name] -> function object
export const registeredFunctions = {}

// A recursive tree of available functions (e.g. used in VmStatementPicker)
export const availableFunctions = []

export default function registerPlugin(objPlugin) {
  plugins.push(objPlugin)
  registerFunctions(objPlugin.functions)

  if (Array.isArray(objPlugin.functions)) {
    availableFunctions.push(...objPlugin.functions)
  }
}

function registerFunctions(objFn) {
  if (!objFn) {
    return
  }

  if (Array.isArray(objFn)) {
    return objFn.forEach(registerFunctions)
  }

  if (Array.isArray(objFn.children)) {
    objFn.children.forEach(registerFunctions)
  }

  if (objFn.name && objFn.callback) {
    registeredFunctions[objFn.name] = objFn
  }
}

// hard-coded default plugins !!!
registerPlugin(pluginFetch)
registerPlugin(pluginWindow)