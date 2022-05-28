export default function getSchemaVariables(objSchema) {
  const retval = []
  populateVariables(objSchema, retval)
  return retval
}

function populateVariables(objSchema, columns, prefix = '') {
  if (objSchema?.properties) {
    for (const [propName, propSchema] of Object.entries(objSchema.properties)) {
      populateVariables({
        ...propSchema,
        name: prefix + propName,
      }, columns, propName + '.')
    }
    return
  }

  columns.push({
    value: '$.' + objSchema.name,
    header: objSchema.label,
    ...objSchema,
  })
}