export default function getSchemaColumns(objSchema, parentName = '') {
  const retval = []

  if (!objSchema) {
    return retval
  }

  if (objSchema.type == 'object' && !objSchema.format) {
    if (typeof objSchema.properties === 'object') {
      for (const [propName, propSchema] of Object.entries(objSchema.properties)) {
        const subColumns = getSchemaColumns(propSchema, parentName ? parentName + '.' + propName : propName)
        retval.push(...subColumns)
      }
    }
  } else {
    retval.push({
      ...objSchema,
      property: parentName,
    })
  }

  return retval
}