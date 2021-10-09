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
import Cms from '../singleton'

export default async function getEditors(block) {
  const definition = await Cms.getDefinition(block)

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

  return retval
}