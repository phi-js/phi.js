/* eslint-disable max-len */
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

const BlockDataEditor = defineAsyncComponent(() => import('../components/CmsBlockEditor/BlockDataEditor.vue'))
const BlockListenersEditor = defineAsyncComponent(() => import('../components/CmsBlockEditor/BlockListenersEditor.vue'))
const BlockVisibilityEditor = defineAsyncComponent(() => import('../components/CmsBlockEditor/BlockVisibilityEditor.vue'))
const BlockCssEditor = defineAsyncComponent(() => import('../components/CmsBlockEditor/BlockCssEditor.vue'))
const BlockValidationEditor = defineAsyncComponent(() => import('../components/CmsBlockEditor/BlockValidationEditor.vue'))
const BlockRepeatEditor = defineAsyncComponent(() => import('../components/CmsBlockEditor/BlockRepeatEditor.vue'))
const BlockTransitionsEditor = defineAsyncComponent(() => import('../components/CmsBlockEditor/BlockTransitionsEditor.vue'))

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

  // v-model editor (only if v-model property exists in definition)
  if (definition.block['v-model'] != undefined) {
    retval.actions.push({
      'id': 'BlockDataEditor',
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
      'id': 'BlockValidationEditor',
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
    'id': 'BlockVisibilityEditor',
    'title': 'Visibility',
    'icon': block['v-if'] ? 'mdi:eye' : 'mdi:eye-outline',
    'component': BlockVisibilityEditor,
    'v-model': 'block',

    'hasData': !!block['v-if'],
    'description': 'This block has conditional visibility',
  })

  // v-on
  retval.actions.push({
    'id': 'BlockListenersEditor',
    'title': 'Events',
    'icon': 'mdi:gesture-tap',
    'component': BlockListenersEditor,
    'v-model': 'block',

    'hasData': block['v-on'] && typeof block['v-on'] == 'object' && Object.keys(block['v-on']).length,
    'description': 'This block reacts to events',
  })

  // Block CSS property
  retval.actions.push({
    'id': 'BlockCssEditor',
    'title': 'Style',
    'icon': 'mdi:water',
    'component': BlockCssEditor,
    'v-model': 'block',

    'hasData': block.props?.style || block.props?.class?.length,
    'description': 'This block has CSS styles',
  })

  // Transitions
  retval.actions.push({
    'id': 'BlockTransitionsEditor',
    'title': 'Transitions',
    'icon': 'mdi:transition',
    'component': BlockTransitionsEditor,
    'v-model': 'block',

    'hasData': !!block.transitions,
    'description': 'This block has transitions',
  })

  // v-for
  if (block.component != 'LayoutPage') { // Hide v-for option for LayoutPage
    retval.actions.push({
      'id': 'BlockRepeatEditor',
      'title': 'Repeat',
      'icon': 'mdi:repeat-variant',
      'component': BlockRepeatEditor,
      'v-model': 'block',

      'hasData': !!block['v-for'],
      'description': 'This block repeats',
    })
  }

  // Raw block source editor
  if (CmsStoryBuidlerSettings?.allowSource) {
    retval.actions.push({
      id: 'BlockSource',
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