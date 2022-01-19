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

  const props = block.props || {}

  if (block.component.substring(0, 5) == 'Input') {
    const inputType = props?.type || 'text'

    switch (inputType) {
    case 'text':
    case 'textarea':
      field.type = 'string'
      break

    case 'number':
      field.type = 'number'
      break

    case 'checkbox':
      field.type = 'boolean'
      break

    case 'select':
    case 'select-list':
    case 'select-buttons':
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
    }

    retval.push(field)
    return retval
  }

  if (block.component == 'MediaVideo') {

    retval.push({
      name: block['v-model'] + '.isPlaying',
      type: 'boolean',
      info: {
        icon: 'mdi:youtube',
        text: 'Video is playing',
      },
    })

    retval.push({
      name: block['v-model'] + '.time',
      type: 'number',
      info: {
        text: 'Video time',
        subtext: '(milliseconds)',
        icon: 'mdi:youtube',
      },
    })

    field.info.icon = 'mdi:youtube'
    field.type = 'object'
    field.properties = { videoTime: { type: 'string' } }

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

    // retval.push(field)
    return retval
  }

  // Block has v-model property, but no block specific field options were determined.  Default to type: string
  field.type = 'string'
  retval.push(field)
  return retval
}