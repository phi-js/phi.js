import { execute } from '../../../../functions'
import { UiForm } from '/packages/ui/components'

export default {
  id: 'google.sheets.getRange',
  icon: 'mdi:google-spreadsheet',
  text: 'Google Sheet: Leer rango',
  secondary: 'Consulta datos de un Google Spreadsheet',
  schema: '... json-schema para el objeto "args"',

  editor: {
    component: UiForm,
    props: {
      fields: [
        {
          model: 'spreadsheetId',
          type: 'text',
          label: 'Sheet ID',
        },
        {
          model: 'range',
          type: 'text',
          label: 'Rango',
          default: 'Sheet1',
        },
      ],
    },
  },

  handler(args) {
    console.log('leyendo spreadsheet', args)

    return execute({
      action: 'http',
      arguments: { url: `/1/google/sheets/sheet/${args.spreadsheetId}?range=${args.range || ''}` },
    }, this)
  },

}