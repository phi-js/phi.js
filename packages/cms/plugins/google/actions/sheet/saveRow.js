import { execute } from '../../../../functions'
import { UiForm } from '/packages/ui/components'

export default {
  id: 'google.sheets.saveRow',
  icon: 'mdi:google-spreadsheet',
  text: 'Google Sheet: Guardar fila',
  secondary: 'Sobreescribe una fila',
  schema: '... json-schema para el objeto "args"',

  editor: {
    component: UiForm,
    props: {
      fields: [
        {
          model: 'spreadsheetId',
          type: 'text',
          label: 'Sheet ID',
          props: { size: 80 },
        },
        {
          model: 'body',
          type: 'json',
          label: 'Body',
        },
      ],
    },
  },

  handler(args) {
    return execute({
      action: 'http',
      arguments: {
        method: 'PUT',
        url: `/1/google/sheets/sheet/${args.spreadsheetId}/record`,
        body: args.body,
      },
    }, this)
  },
}