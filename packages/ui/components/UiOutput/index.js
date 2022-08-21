export { default as UiOutput } from './UiOutput.vue'

export const injectedTypes = {}

export function defineOutputType(typeName, typeComponent) {
  injectedTypes[typeName] = typeComponent
}