/*
Retorna todos los editores (listos para usar en <component>) relacionados al bloque

{
  face: {
    component: x,
    props: ...
  },

  toolbar: {
    component: x,
    props: ...
  },

  actions: [
    {
      text: 'Cosa 1',
      icon 'ble ble ble',
      component: x,
      props: ...
    }
  ],
}
*/
import { defineAsyncComponent } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInputJson } from '@/packages/ui/components'

import getBlockDefinition from './getBlockDefinition.js'
import BlockDataEditor from '../components/CmsBlockEditor/BlockDataEditor.vue'
import BlockListenersEditor from '../components/CmsBlockEditor/BlockListenersEditor.vue'
import BlockVisibilityEditor from '../components/CmsBlockEditor/BlockVisibilityEditor.vue'
import BlockCssEditor from '../components/CmsBlockEditor/BlockCssEditor.vue'
import BlockValidationEditor from '../components/CmsBlockEditor/BlockValidationEditor.vue'
import BlockRepeatEditor from '../components/CmsBlockEditor/BlockRepeatEditor.vue'
import BlockTransitionsEditor from '../components/CmsBlockEditor/BlockTransitionsEditor.vue'

import dictionary from '../i18n/index.js'
const i18n = useI18n(dictionary)

/*
CmsStoryBuilderSettings as defined in prop "settings" of:
components\CmsStoryBuilder\CmsStoryBuilder.vue
*/

export default function getBlockEditors(block, CmsStoryBuidlerSettings = null) {
  const definition = getBlockDefinition(block)

  const retval = {
    face: null,
    toolbar: null,
    actions: [],
  }

  if (!definition) {
    return retval
  }

  // Determine "face"
  if (definition?.editor?.face?.component) {
    retval.face = {
      'component': definition.editor.face.component,
      'props': definition.editor.face?.props,
      'v-model': definition.editor.face?.['v-model'],
    }

    if (typeof retval.face.component === 'function') {
      retval.face.component = defineAsyncComponent(retval.face.component)
    }
  }

  // Determine "toolbar"
  if (definition?.editor?.toolbar?.component) {
    const toolbar = {
      'component': definition.editor.toolbar.component,
      'props': definition.editor.toolbar?.props,
      'v-model': definition.editor.toolbar?.['v-model'],
    }
    if (typeof toolbar.component === 'function') {
      toolbar.component = defineAsyncComponent(toolbar.component)
    }
    retval.toolbar = toolbar
  }

  // Determine "actions"
  if (Array.isArray(definition?.editor?.actions)) {
    const actions = definition.editor.actions
      .map((action) => {
        if (typeof action?.component === 'function') {
          return {
            ...action,
            component: defineAsyncComponent(action.component),
          }
        } else {
          return action
        }
      })
      .map((action) => {
        action.icon = action?.icon || definition?.icon
        return action
      })

    retval.actions = actions
  }

  // BUILT IN ACTIONS:
  // Shown in the block options dropdown in the order declared here

  // Validation editor (only if v-model property exists in definition)
  if (definition.block['v-model'] != undefined) {
    retval.actions.push({
      'id': 'data',
      'title': 'Data',
      'icon': 'mdi:code-json',
      'component': BlockDataEditor,
      'v-model': 'block',

      'hasData': true,
      'description': block['v-model'],
    })
  }

  // Validation editor (only if v-model property exists in definition)
  if (definition.block['v-model'] != undefined) {
    retval.actions.push({
      'id': 'validation',
      'title': 'Validation',
      'icon': 'mdi:message-alert',
      'component': BlockValidationEditor,
      'v-model': 'block',

      'hasData': Array.isArray(block.rules) && block.rules.length,
      'description': 'This block has validation rules',
    })
  }

  // Visibility: v-if
  retval.actions.push({
    'id': 'visibility',
    'title': 'Visibility',
    'icon': block['v-if'] ? 'mdi:eye' : 'mdi:eye-outline',
    'component': BlockVisibilityEditor,
    'v-model': 'block',

    'hasData': !!block['v-if'],
    'description': 'This block has conditional visibility',
  })

  // Block CSS property
  retval.actions.push({
    'id': 'css',
    'title': 'Style',
    'icon': 'mdi:water',
    'component': BlockCssEditor,
    'v-model': 'block',

    'hasData': block.props?.style || block.props?.class?.length,
    'description': 'This block has CSS styles',
  })

  // Transitions
  retval.actions.push({
    'id': 'transitions',
    'title': 'Transitions',
    'icon': 'mdi:transition',
    'component': BlockTransitionsEditor,
    'v-model': 'block',

    'hasData': !!block.transitions,
    'description': 'This block has transitions',
  })

  // v-on
  retval.actions.push({
    'id': 'events',
    'title': 'Events',
    'icon': 'mdi:gesture-tap',
    'component': BlockListenersEditor,
    'v-model': 'block',

    'hasData': block['v-on'] && typeof block['v-on'] == 'object' && Object.keys(block['v-on']).length,
    'description': 'This block reacts to events',
  })

  // v-for
  retval.actions.push({
    'id': 'repeat',
    'title': 'Repeat',
    'icon': 'mdi:repeat-variant',
    'component': BlockRepeatEditor,
    'v-model': 'block',

    'hasData': !!block['v-for'],
    'description': 'This block repeats',
  })

  // Raw block source editor
  if (CmsStoryBuidlerSettings?.allowSource) {
    retval.actions.push({
      id: 'source',
      title: 'Source',
      icon: 'mdi:code-json',
      component: UiInputJson,
    })
  }

  // Translate titles
  retval.actions = retval.actions.map((action) => {
    if (!action.id) {
      console.warn('getBlockEditors: no action.id for', action)
    }

    return {
      ...action,
      title: i18n.t(`BlockEditors.actions.${action.id}.title`, null, action.title),
      description: i18n.t(`BlockEditors.actions.${action.id}.description`, null, action.description),
    }
  })

  return retval
}