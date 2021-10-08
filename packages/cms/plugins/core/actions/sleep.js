const SleepEditor = () => { };

export default {
  id: 'sleep',
  text: 'Sleep',
  secondary: 'Espera una cantidad determinada de milisegundos',
  schema: '... json-schema para el objeto "args"',

  handler(args) {
    let duration = args && typeof args.duration != 'undefined' ? args.duration : 1000;
    console.log('sleep> iniciando');

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('sleepdone');
        console.log('sleep> terminado');
      }, duration);
    });

  },

  editor: {
    component: SleepEditor,
    props: {
      someProp: 1
    },
    'v-model': '$action.args'
  }
}