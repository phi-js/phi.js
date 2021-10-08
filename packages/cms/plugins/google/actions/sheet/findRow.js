import { execute } from '../../../../functions'
import { UiForm } from '/packages/ui/components'

function serialize(obj, prefix) {
  if (!obj) {
    return null
  }

  var str = []
  for (var p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      var k = prefix ? prefix + '[' + p + ']' : p
      var v = obj[p]

      if (v == null) {
        continue
      }

      if (typeof v == 'object') {
        str.push(this.serialize(v, k))
      } else if (typeof v == 'number' || v.length > 0) {
        str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v))
      }
    }
  }
  return str.join('&')
}

export default {
  id: 'google.sheets.findRow',
  icon: 'mdi:google-spreadsheet',
  text: 'Google Sheet: Buscar fila',
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
          props: { size: 80 },
        },
        {
          model: 'key',
          type: 'json',
          label: 'Columnas',
        },
      ],
    },
  },

  handler(args) {
    return execute({
      action: 'http',
      arguments: { url: `/1/google/sheets/sheet/${args.spreadsheetId}/record?${serialize(args.key, 'key')}` },
    }, this)
  },

}