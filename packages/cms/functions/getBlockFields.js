export default function getBlockFields(block) {
  let retval = []

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
    if (block['v-model:isPlaying']) {
      retval.push({
        name: block['v-model:isPlaying'],
        type: 'boolean',
        info: {
          icon: 'mdi:youtube',
          text: 'Video is playing',
        },
        important: true,
      })
    }

    if (block['v-model:currentTime']) {
      retval.push({
        name: block['v-model:currentTime'],
        type: 'number',
        info: {
          text: 'Video time',
          subtext: '(milliseconds)',
          icon: 'mdi:youtube',
        },
        important: true,
      })
    }

    if (block['v-model:activeChapters']) {
      retval.push({
        name: block['v-model:activeChapters'],
        type: 'array',
        info: {
          icon: 'mdi:youtube',
          text: block['v-model:activeChapters'],
        },
        items: {
          type: 'string',
          enum: block.props.chapters.map((chapter) => ({
            value: chapter.name,
            text: `${chapter.name} (${chapter.start}-${chapter.end})`,
          })),
        },
        important: true,
      })
    }

    return retval
  }

  return []
}