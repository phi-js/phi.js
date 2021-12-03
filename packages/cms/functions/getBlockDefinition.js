import Cms from '../singleton'

export default async function getBlockDefinition(block) {
  return Cms.getDefinition(block)
}