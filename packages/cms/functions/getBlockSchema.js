import getBlockFields from './getBlockFields'

export default function getBlockSchema(block) {
  const fields = recursiveGetBlockFields(block)
  if (!fields.length) {
    return null
  }

  const properties = {}
  fields.forEach((field) => {
    properties[field.name] = field
  })

  return {
    type: 'object',
    properties,
  }
}

function recursiveGetBlockFields(block) {
  let retval = []

  if (block?.slot?.length >= 1) {
    for (const child of block.slot) {
      retval.push(...recursiveGetBlockFields(child))
    }
    return retval
  }

  return getBlockFields(block)
}