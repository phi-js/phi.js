import forEachBlock from './forEachBlock'
import getBlockFields from './getBlockFields'

export default function getStorySchema(story) {
  const blockFields = []
  forEachBlock(story, (block) => blockFields.push(...getBlockFields(block)))
  return blockFields
}
