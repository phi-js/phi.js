export default function getBlockSchema(block) {
  const fields = getBlockFields(block)
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

function getBlockFields(block) {
  let retval = []

  if (block?.slot?.length >= 1) {
    for (const child of block.slot) {
      retval = retval.concat(getBlockFields(child))
    }
    return retval
  }

  if (!block['v-model']) {
    return []
  }

  let field = {
    name: block['v-model'],
    type: null,
    props: null,
    info: {
      text: block['v-model'],
      subtext: block.props?.label || '',
      icon: null,
    },
  }

  const props = block.props

  switch (block.component) {
  case 'InputSelect':
    field.info.icon = 'mdi:form-dropdown'

    if (props.multiple) {
      field.type = 'array'
      field.items = {
        type: 'string',
        enum: props.options || [],
      }
    } else {
      field.type = 'string'
      field.enum = props.options || []
    }
    break

  case 'InputText':
  case 'InputTextarea':
    field.type = 'text'
    break

  case 'InputNumber':
    field.type = 'number'
    break

  case 'InputCheckbox':
    field.type = 'boolean'
    break

  case 'MediaVideo':
    field.type = 'object'
    field.properties = { videoTime: { type: 'string' } }
    field.info.icon = 'mdi:youtube'

    if (Array.isArray(block?.props?.chapters)) {
      field.properties.chapters = {
        type: 'array',
        items: {
          type: 'string',
          enum: block.props.chapters.map((chapter) => ({
            value: chapter.name,
            text: `${chapter.name} (${chapter.start}-${chapter.end})`,
          })),
        },
      }
    }

    if (block?.['v-model:activeChapters']) {
      // retval.properties[block['v-model:activeChapters']] = field.properties.chapters
      retval.push({
        name: block['v-model:activeChapters'],
        ...field.properties.chapters,
        info: {
          icon: 'mdi:youtube',
          text: block['v-model:activeChapters'],
        },
      })
    }
    break

  default:
    field.type = 'string'
    break
  }

  retval.push(field)

  return retval
}