/*
Given a BLOCK object, returns an ARRAY of found/declared valid VM FIELD OBJECTS:

returns [
  {
    value: "record.name",  // JSON path of the modelValue's property
    type: "string",

    text: "Nombre", // propiedades de UiItem (text, subtext, icon)
    subtext: "El nombre de la persona",
    icon: "mdi:form-textbox"
  },
  {
    value: "record.choice",
    type: "string",
    enum: [
      { value: 'one', text: 'UNO' },
      { value: 'two', text: 'DOS' },
      { value: 'three', text: 'TRES' },
      { value: 'four', text: 'CUATRO' },
    ]
  }
]
*/
export default function getBlockFields(block) {
  const retval = []

  const field = {
    value: block['v-model'],
    type: null,
    text: block._plugin_api_storage?.title
      || block.props?.label
      || block.props?.placeholder
      || block['v-model'],
    subtext: block['v-model'],
    icon: 'mdi:form-textbox',
  }

  const props = block.props || {}

  if (block.component.substring(0, 5) == 'Input') {
    if (!block['v-model'] || block['v-model'][0] == '$') { // ignore v-model variables starting with $ !!!!
      return []
    }

    const inputType = props?.type || 'text'
    field.type = inputType

    switch (inputType) {
    case 'text':
      field.icon = 'mdi:form-textbox'
      field.type = 'string'
      break
    case 'textarea':
      field.icon = 'mdi:form-textarea'
      field.type = 'string'
      break

    case 'checkbox':
      field.icon = 'mdi:checkbox-blank-outline'
      field.type = 'boolean'
      break

    case 'select':
    case 'select-native':
    case 'select-list':
    case 'select-buttons':
      field.icon = 'mdi:form-dropdown'

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
      field.icon = 'mdi:paperclip'
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

  if (block.component == 'MediaVideo' || block.component == 'MediaVideoContainer') {
    if (block['v-model:isPlaying']) {
      retval.push({
        value: block['v-model:isPlaying'],
        type: 'boolean',

        icon: 'mdi:youtube',
        text: 'Video is playing',
        important: true,
      })
    }

    if (block['v-model:currentTime']) {
      retval.push({
        value: block['v-model:currentTime'],
        type: 'number',
        text: 'Video time',
        subtext: '(milliseconds)',
        icon: 'mdi:youtube',
        important: true,
      })
    }

    if (block['v-model:activeChapters']) {
      const arrChapters = Array.isArray(block.props?.chapters) ? block.props.chapters : []

      retval.push({
        value: block['v-model:activeChapters'],
        type: 'array',
        icon: 'mdi:youtube',
        text: block['v-model:activeChapters'],
        items: {
          type: 'string',
          enum: arrChapters.map((chapter) => ({
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