export default {
  echo(args) {
    return args
  },

  'console.log'(args) {
    return console.log(
      '%c[phi]',
      'background: blue; color: #bada55',
      args,
    )
  },

  'window.alert'(args) {
    if (args && typeof args.message != 'undefined') {
      args = args.message
    }
    return window.alert(args)
  },

  'window.confirm'(args) {
    if (args && typeof args.message != 'undefined') {
      args = args.message
    }
    return window.confirm(args)
  },

  'window.prompt'({ message, placeholder }) {
    return window.prompt(message, placeholder)
  },

  fetch({ url, options }) {
    if (options && options.body && typeof options.body != 'string') {
      options.body = JSON.stringify(options.body)
    }

    if (options?.method) {
      options.method = options.method.toUpperCase()
    }

    return fetch(url, options).then((response) => response.json())
  },
}