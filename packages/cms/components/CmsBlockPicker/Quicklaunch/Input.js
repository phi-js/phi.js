export default function (text) {
  let isInput = text.substr(0, 2) == '{{' && text.slice(-2) == '}}'
  if (!isInput) {
    return
  }
  let varname = text.slice(2, -2)

  return {
    name: 'InputText',
    title: 'Text',
    icon: 'mdi:form-textbox',

    block: {
      'v-model': varname,
      'props': { type: 'text', label: varname },
    },
  }
}