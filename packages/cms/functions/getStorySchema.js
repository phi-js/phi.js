import forEachBlock from './forEachBlock'
import getBlockFields from './getBlockFields'

export default function getStorySchema(story) {
  const blockFields = []
  forEachBlock(story, (block) => blockFields.push(...getBlockFields(block)))

  const retval = {
    type: 'object',
    properties: {},
  }

  blockFields.forEach((field) => {
    spliceField(retval, field)
    // if (!retval.properties[field.name] || field.important) {
    //   retval.properties[field.name] = field
    // }
  })

  return retval
}

function spliceField(schema, field) {
  if (!field?.name) {
    console.warn('invalid field', field)
    return
  }

  const parts = field.name.split('.')
  const fieldName = parts.shift()

  if (parts.length == 0) {
    if (!schema.properties[fieldName] || field.important) {
      schema.properties[fieldName] = field
    }
  } else {
    if (!schema.properties[fieldName]) {
      schema.properties[fieldName] = {
        type: 'object',
        properties: {},
      }
    }

    spliceField(schema.properties[fieldName], { ...field, name: parts.join('.') })
  }

  return schema
}