import Tucompra from './Tucompra.vue';

export default {
  component: Tucompra,
  settingsSchema: {
    fields: [
      {
        type: 'text',
        label: 'URL',
        model: 'url',
      },


      {
        type: 'text',
        label: 'Secret Key (TUCOMPRA KEY)',
        model: 'secretKey',
      },

      {
        type: 'text',
        label: 'Usuario (TUCOMPRA ID)',
        model: 'usuario',
      },

    ]
  }
}