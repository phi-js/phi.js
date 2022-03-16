import Banorte from './Banorte.vue';

export default {
  component: Banorte,
  settingsSchema: {
    fields: [
      {
        type: 'text',
        label: 'User',
        model: 'User',
      },

      {
        type: 'password',
        label: 'Password',
        model: 'Password',
      },

      {
        type: 'text',
        label: 'Terminal ID',
        model: 'TerminalID',
      },

      {
        type: 'text',
        label: 'Merchant ID',
        model: 'MerchantID'
      },

      {
        type: 'text',
        label: 'Merchant Name',
        model: 'MerchantName'
      },

      {
        type: 'text',
        label: 'Merchant City',
        model: 'MerchantCity'
      },

      {
        type: 'text',
        label: 'Language',
        model: 'Language',
        default: 'ES'
      },

      {
        type: 'select',
        label: 'Mode',
        model: 'Mode',
        default: 'RND',
        options: [
          {
            text: 'Pruebas: resultado aleatorio (RND)',
            value: 'RND'
          },
          {
            text: 'Pruebas: autorizar (AUT)',
            value: 'AUT'
          },
          {
            text: 'Pruebas: declinar (DEC)',
            value: 'DEC'
          },
          {
            text: 'Entorno de producción (PRD)',
            value: 'PRD'
          },
        ]
      }
    ]
  }
}