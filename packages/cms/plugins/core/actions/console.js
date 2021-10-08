const ActionConsoleEditor = () => import('../components/Action/ConsoleEditor.vue');

export default {
  id: 'console',
  icon: 'mdi:console-line',
  text: 'Mostrar en consola',
  secondary: 'Despliega información en la consola del navegador',
  schema: '... json-schema para el objeto "args"',

  handler(args) {
    console.log("CMS>", args, this);
  },

  editor: {
    component: ActionConsoleEditor
  }
}