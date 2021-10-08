/*

Accion atomica:

{
  "action": "action.name",
  "args": "... action arguments ...."
}


Ejecutador / bloque logico(?)

Forma mas sencilla:

{
  "do": [ .. arreglo de condiciones atomicas, o bloques logicos ..]
}


Funcion a ejecutar al terminar ("then")

{
  "do": [ .. arreglo de condiciones atomicas, o bloques logicos ..]
  "then": [ .. arreglo de condiciones atomicas, o bloques logicos ..]
}


Condicionales

{
  "if": "condition",
  "do": [ .. arreglo de condiciones atomicas, o bloques logicos ..],
  "else": [ .. arreglo de condiciones atomicas, o bloques logicos ..],
  "then": [ .. arreglo de condiciones atomicas, o bloques logicos ..]
}


Ejemplo completo

{
  "if": "Tiene sintomas",

  "do": [
    {"action": "foo", "args": "fooArgs"},
    {"action": "bar", "args": "barArgs"}
  ],

  "else": [
    {"action": "foo", "args": "fooArgs"},

    {
      "do": [{"action": "bar", "args": "barArgs"}],
      "then": [
        {"action": "foo", "args": "fooArgs"},
        {"action": "bar", "args": "barArgs"}
      ]
    }
  ],

  "then": [
    {"action": "foo", "args": "fooArgs"},
    {"action": "bar", "args": "barArgs"}
  ]
}


Todos estos deberian ser llamados validos!

// lo minimo
run({"action": "foo", "args": "fooArgs"});   

// acciones en secuencia
run([
  {"action": "foo", "args": "fooArgs"},
  {"action": "foo", "args": "fooArgs"},
  {"action": "foo", "args": "fooArgs"}
]);   

// acciones condicionadas
run({  
  "if": "...condition...",
  "do": "...ejecutable...",  // cualquiera de estos ejemplos!
  "else": "...ejecutable...",  // cualquiera de estos ejemplos!
});






*/
import execute from './execute.js';
// import { validate } from '../../validation';

export default async function run(logic, data = null, bindThis = null, actionDoneHandler = null) {
  if (!logic) {
    return;
  }

  // accion atomica
  if (typeof logic.action != 'undefined') {
    return execute(logic, bindThis);
  }

  let targetActions = Array.isArray(logic) ? logic : logic.do;

  if (logic.if && data) {
    // if (!await validate(data, logic.if)) {
    //   targetActions = logic.else;
    // }
  }

  if (!targetActions) {
    return;
  }

  if (typeof actionDoneHandler != 'function') {
    actionDoneHandler = (resultObj) => resultObj;
  }

  // Ejecutar una a una
  for (let i = 0; i < targetActions.length; i++) {
    let action = targetActions[i];
    await run(action, data, bindThis, actionDoneHandler)
      .then(result => actionDoneHandler({
        action,
        result
      }))
  }

  // let promises = [];
  // targetActions.forEach(action => {
  //   let runAction = run(action, data, bindThis, actionDoneHandler)
  //     .then(result => actionDoneHandler({
  //       action,
  //       result
  //     }))

  //   promises.push(runAction);
  // });
  // let result = await Promise.all(promises);

  let thenPromises = [];
  let then = logic.then || [];
  then.forEach(action => {
    let runAction = run(action, data, bindThis, actionDoneHandler)
      .then(result => actionDoneHandler({
        action,
        result
      }));

    thenPromises.push(runAction);
  });

  await Promise.all(thenPromises);

  // return result;
}