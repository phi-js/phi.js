import forEachBlock from './forEachBlock'
import getBlockFields from './getBlockFields'

export default function getStorySchema(story) {
  const properties = []
  forEachBlock(story, (block) => properties.push(...getBlockFields(block)))

  const retval = {
    type: 'object',
    properties: {},
  }

  properties.forEach((property) => {
    if (!retval.properties[property.name] || property.important) {
      retval.properties[property.name] = property
    }
  })

  return retval
}