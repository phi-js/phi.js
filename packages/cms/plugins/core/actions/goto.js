export default {
  id: 'goto',
  icon: 'mdi:open-in-new',
  text: 'Ir a ...',
  secondary: 'Navegar hacia un Phi',
  schema: '... json-schema para el objeto "args"',

  handler(args) {
    console.log('goto:', args, this);
  }
}