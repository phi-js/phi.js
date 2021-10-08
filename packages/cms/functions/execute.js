/*
execute.js

"execute" es una funcion que recibe un objeto definiendo una ACCION y sus ARGUMENTOS (opt.)

myAction = {
  "action": "doSomeThing",
  "arguments": {
    "thing": "foo"
  }
}


Las acciones a ejecutar se deben definir en PLUGINS,
e.g.: packages/cms/plugins/core/index.js





Binding:
let result = execute(myAction, objectToBindAsThis)

equivale a
let result = doSomeThing({"thing": "foo"}).bind(objectToBindAsThis);

*/
import CMS from '../singleton'

export default async function (actionObject, bind) {

  if (!actionObject || typeof actionObject != 'object' || !actionObject.action) {
    throw {
      message: 'cms/functions/execute: Invalid action',
      object: actionObject
    };
  }

  let actionDefinition = await CMS.getActionDefinition(actionObject.action);
  if (!actionDefinition) {
    throw {
      message: 'cms/functions/execute: Could not determine action',
      object: actionObject
    };
  }

  if (typeof actionDefinition == 'function') {
    return actionDefinition.bind(bind)(actionObject.arguments);
  }

  if (typeof actionDefinition.handler == 'function') {
    return actionDefinition.handler.bind(bind)(actionObject.arguments);
  }

  throw {
    message: 'cms/functions/execute: No handler found in action',
    object: actionObject,
    definition: actionDefinition
  };
}