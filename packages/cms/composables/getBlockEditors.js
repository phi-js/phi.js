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

import { defineAsyncComponent } from '@vue/runtime-core'
import getBlockDefinition from './getBlockDefinition.js'
import { UiInput } from '/packages/ui/components'
import { VmStatement } from '/packages/vm/components'
import BlockListenersEditor from '../components/CmsBlockEditor/BlockListenersEditor.vue'

export default async function getBlockEditors(block) {
  const definition = await getBlockDefinition(block)

  const retval = {
    face: null,
    toolbar: null,
    actions: [],
  }

  if (definition?.editor?.face?.component) {
    const face = {
      component: definition.editor.face.component,
      props: definition.editor.face?.props,
    }
    if (typeof face.component === 'function') {
      face.component = defineAsyncComponent(face.component)
    }
    retval.face = face
  }

  if (definition?.editor?.toolbar?.component) {
    const toolbar = {
      component: definition.editor.toolbar.component,
      props: definition.editor.toolbar?.props,
    }
    if (typeof toolbar.component === 'function') {
      toolbar.component = defineAsyncComponent(toolbar.component)
    }
    retval.toolbar = toolbar
  }

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

    retval.actions = actions
  }

  retval.actions.push({
    'title': 'v-if',
    'icon': 'mdi:vuejs',
    'component': VmStatement,
    'props': { default: { and: [] } },
    'v-model': 'block.v-if',
  })

  if (definition?.block?.['v-model']) {
    retval.actions.push({
      'title': 'v-model',
      'icon': 'mdi:vuejs',
      'component': UiInput,
      'props': { type: 'text' },
      'v-model': 'block.v-model',
    })
  }

  retval.actions.push({
    'title': 'v-for',
    'icon': 'mdi:vuejs',
    'component': UiInput,
    'props': { type: 'text' },
    'v-model': 'block.v-for',
  })

  retval.actions.push({
    'title': 'v-on',
    'icon': 'mdi:vuejs',
    'component': BlockListenersEditor,
    'v-model': 'block',
  })

  retval.actions.push({
    title: 'Source',
    icon: 'mdi:vuejs',
    component: UiInput,
    props: { type: 'json' },
  })

  return retval
}