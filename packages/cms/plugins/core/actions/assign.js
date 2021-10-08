export default {
  id: 'assign',
  icon: 'mdi:variable',
  text: 'Variable',
  secondary: 'Establece el valor de una variable',
  schema: '... json-schema para el objeto "args"',

  handler(args) {
    if (typeof args == 'object') {
      args = JSON.stringify(args);
    }
    return Function('"use strict";return (' + args + ')')();

    // return args;
  },

}