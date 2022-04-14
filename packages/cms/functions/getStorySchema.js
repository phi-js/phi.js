import forEachBlock from './forEachBlock'
import getBlockFields from './getBlockFields'

export default function getStorySchema(story) {
  const properties = []
  forEachBlock(story, (block) => properties.push(...getBlockFields(block)))

  return {
    type: 'object',
    properties,
  }
}