export default function (text) {
  let parts = text.split('|')
  if (parts.length < 2) {
    return
  }

  let options = []

  parts.forEach((part) => {
    let text = part.trim()
    if (text) {
      options.push({
        text,
        value: text.replace(/\s+/g, '_').toLowerCase(),
      })
    }
  })

  return {
    name: 'InputSelect',
    title: 'Select',
    icon: 'mdi:form-dropdown',

    block: {
      'v-model': '',
      'props': {
        type: 'select-list',
        multiple: false,
        options,
      },
    },
  }
}