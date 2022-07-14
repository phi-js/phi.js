import { allBlocks } from './usePlugin.js'

export default function getBlockDefinition(block) {
  if (!block?.component) {
    return null
  }

  return allBlocks[block.component]
}