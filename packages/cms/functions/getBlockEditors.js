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
import getBlockDefinition from './getBlockDefinition.js'
import { UiInputJson } from '@/packages/ui/components'
import BlockListenersEditor from '../components/CmsBlockEditor/BlockListenersEditor.vue'
import BlockModelsEditor from '../components/CmsBlockEditor/BlockModelsEditor.vue'
import BlockVisibilityEditor from '../components/CmsBlockEditor/BlockVisibilityEditor.vue'
import { parse } from '../../vm/lib/utils'

export default async function getBlockEditors(block, $settings = {}) {
  const definition = await getBlockDefinition(block)

  const retval = {
    face: null,
    toolbar: null,
    actions: [],
  }

  if (!definition) {
    return retval
  }

  // Determine "face"
  const face = definition?.editor?.face?.component ? {
    'component': definition.editor.face.component,
    'props': definition.editor.face?.props,
    'v-model': definition.editor.face?.['v-model'],
  } : {
    component: definition.block.component,
    props: definition.block?.props,
  }

  if (typeof face.component === 'function') {
    face.component = defineAsyncComponent(face.component)
  }
  retval.face = face
  // parse $settings in definitions
  retval.face.props = parse(retval.face.props, { $settings }, true)

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

    // parse $settings in definitions
    retval.toolbar.props = parse(retval.toolbar.props, { $settings }, true)
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
        // parse $settings in definitions
        action.props = parse(action.props, { $settings }, true)
        action.icon = action?.icon || definition?.icon
        return action
      })

    retval.actions = actions
  }

  // BUILT IN ACTIONS:

  // Visibility: v-if  and v-for
  retval.actions.push({
    'id': 'visibility',
    'title': 'Visibility',
    'icon': block['v-if'] || block['v-for'] ? 'mdi:eye' : 'mdi:eye-outline',
    'component': BlockVisibilityEditor,
    'v-model': 'block',
  })

  // v-model:* editor
  let hasModels = false
  for (const propName in definition.block) {
    if (propName.substr(0, 7) === 'v-model') {
      hasModels = true
      break
    }
  }
  if (hasModels) {
    retval.actions.push({
      'id': 'variables',
      'title': 'Variables',
      'icon': 'mdi:variable',
      'component': BlockModelsEditor,
      'v-model': 'block',
    })
  }

  // v-on
  retval.actions.push({
    'id': 'events',
    'title': 'Events',
    'icon': 'mdi:gesture-tap',
    'component': BlockListenersEditor,
    'v-model': 'block',
  })

  // "style" prop
  retval.actions.push({
    'id': 'style',
    'title': 'Style',
    'icon': 'mdi:palette',
    'component': UiInputJson,
    'v-model': 'block.props.style',
  })

  // Raw block source editor
  retval.actions.push({
    id: 'source',
    title: 'Source',
    icon: 'mdi:code-json',
    component: UiInputJson,
  })

  return retval
}