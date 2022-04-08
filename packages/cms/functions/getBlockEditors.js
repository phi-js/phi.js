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
import BlockVisibilityEditor from '../components/CmsBlockEditor/BlockVisibilityEditor.vue'
import BlockCssEditor from '../components/CmsBlockEditor/BlockCssEditor.vue'
import BlockDictionaryEditor from '../components/CmsBlockEditor/BlockDictionaryEditor.vue'
import BlockValidationEditor from '../components/CmsBlockEditor/BlockValidationEditor.vue'

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
  if (definition?.editor?.face?.component) {
    retval.face = {
      'component': definition.editor.face.component,
      'props': definition.editor.face?.props,
      'v-model': definition.editor.face?.['v-model'],
    }

    if (typeof retval.face.component === 'function') {
      retval.face.component = defineAsyncComponent(retval.face.component)
    }

    retval.face.props = parse(retval.face.props, { $settings }, true)
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
  // Shown in the block options dropdown in the order declared here

  // Validation editor (only if v-model property exists in definition)
  if (definition.block['v-model'] != undefined) {
    retval.actions.push({
      'id': 'validation',
      'title': 'Validation',
      'icon': 'mdi:message-alert',
      'component': BlockValidationEditor,
      'v-model': 'block',
    })
  }

  // Block CSS property
  retval.actions.push({
    'id': 'css',
    'title': 'Style',
    'icon': 'mdi:palette-advanced',
    'component': BlockCssEditor,
    'v-model': 'block',
  })

  // Visibility: v-if
  retval.actions.push({
    'id': 'visibility',
    'title': 'Visibility',
    'icon': block['v-if'] ? 'mdi:eye' : 'mdi:eye-outline',
    'component': BlockVisibilityEditor,
    'v-model': 'block',
  })

  // v-on
  retval.actions.push({
    'id': 'events',
    'title': 'Events',
    'icon': 'mdi:gesture-tap',
    'component': BlockListenersEditor,
    'v-model': 'block',
  })

  // DEPRECATED:  Build into BlockVisibilityEditor
  // // v-for
  // retval.actions.push({
  //   'id': 'v-for',
  //   'title': 'Repeat',
  //   'icon': 'mdi:repeat-variant',
  //   'component': UiForm,
  //   'props': {
  //     fields: [
  //       {
  //         type: 'text',
  //         model: 'v-for',
  //         label: 'Repeat for every item in',
  //         subtext: 'The iterated value is available as $item',
  //       },
  //     ],
  //   },
  //   'v-model': 'block',
  // })

  // Too cluttered.  Let users use the global Dictionary option (in the story builder)
  // // Dictionary (block.i18n)
  // retval.actions.push({
  //   id: 'i18n',
  //   title: 'Dictionary',
  //   icon: 'mdi:translate',
  //   component: BlockDictionaryEditor,
  // })

  // Raw block source editor
  if ($settings?.allowSource) {
    retval.actions.push({
      id: 'source',
      title: 'Source',
      icon: 'mdi:code-json',
      component: UiInputJson,
    })
  }


  return retval
}