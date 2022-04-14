export default function getBlockFields(block) {
  let retval = []

  if (!block['v-model']) {
    return []
  }

  let field = {
    name: block['v-model'],
    type: null,
    props: null,
    info: {
      text: block.props?.label || '',
      subtext: block['v-model'],
      icon: null,
    },
  }

  const props = block.props || {}

  if (block.component.substring(0, 5) == 'Input') {
    const inputType = props?.type || 'text'
    field.type = inputType

    switch (inputType) {
    case 'text':
    case 'textarea':
      field.type = 'string'
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

    case 'upload':
      field.info.text = props.placeholder || null
      field.info.icon = 'mdi:paperclip'

      if (props.multiple) {
        field.type = 'array'
        field.items = { type: 'upload' }
      } else {
        field.type = 'upload'
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
      retval.push({
        name: block['v-model:activeChapters'],
        ...field.properties.chapters,
        info: {
          icon: 'mdi:youtube',
          text: block['v-model:activeChapters'],
        },
      })
    }

    return retval
  }

  // Block has v-model property, but no block specific field options were determined.  Default to type: string
  field.type = 'string'
  retval.push(field)
  return retval
}