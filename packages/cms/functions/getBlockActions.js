/*
Retorna una lista de todas las "acciones" asociadas al bloque

[
  {
    id: 'visibility',
    title: 'Visibilidad',
    icon: 'mdi:eye',
    hasData: true
  },
  {
    id: 'block-thing-1',
    title: 'Cosa propia del bloque',
    icon: 'mdi:thing',
    hasData: true
  },
]
*/
import getBlockDefinition from './getBlockDefinition.js'

/*
CmsStoryBuilderSettings as defined in prop "settings" of:
components\CmsStoryBuilder\CmsStoryBuilder.vue
*/
export default function getBlockActions(block, CmsStoryBuidlerSettings = null) {
  const definition = getBlockDefinition(block)
  if (!definition) {
    return []
  }

  const retval = []

  // Block defined actions
  if (Array.isArray(definition?.editor?.actions)) {
    definition.editor.actions.forEach((action) => {
      retval.push({
        ...action,
        icon: action?.icon || definition?.icon,
      })
    })
  }

  // BUILT IN ACTIONS:
  // Shown in the block options dropdown in the order declared here

  // Validation editor (only if v-model property exists in definition)
  if (definition.block['v-model'] != undefined) {
    retval.push({
      id: 'data',
      title: 'Data',
      icon: 'mdi:code-json',
      hasData: definition.block['v-model'] !== undefined,
      description: block['v-model'],
    })
  }

  // Validation editor (only if v-model property exists in definition)
  if (definition.block['v-model'] != undefined) {
    retval.push({
      id: 'validation',
      title: 'Validation',
      icon: 'mdi:message-alert',
      hasData: Array.isArray(block.rules) && block.rules.length,
      description: 'This block has validation rules',
    })
  }

  // Visibility: v-if
  retval.push({
    id: 'visibility',
    title: 'Visibility',
    icon: block['v-if'] ? 'mdi:eye' : 'mdi:eye-outline',
    hasData: !!block['v-if'],
    description: 'This block has conditional visibility',
  })

  // Block CSS property
  retval.push({
    id: 'css',
    title: 'Style',
    icon: 'mdi:water',
    hasData: block.props?.style || block.props?.class?.length,
    description: 'This block has CSS styles',
  })

  // Transitions
  retval.push({
    id: 'transitions',
    title: 'Transitions',
    icon: 'mdi:transition',
    hasData: !!block.transitions,
    description: 'This block has transitions',
  })

  // v-on
  retval.push({
    id: 'events',
    title: 'Events',
    icon: 'mdi:gesture-tap',
    hasData: !!block['v-on'],
    description: 'This block reacts to events',
  })

  // v-for
  retval.push({
    id: 'repeat',
    title: 'Repeat',
    icon: 'mdi:repeat-variant',
    hasData: !!block['v-for'],
    description: 'This block repeats',
  })

  // Raw block source editor
  if (CmsStoryBuidlerSettings?.allowSource) {
    retval.push({
      id: 'source',
      title: 'Source',
      icon: 'mdi:code-json',
    })
  }

  return retval
}