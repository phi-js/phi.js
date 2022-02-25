import { provide, inject, useAttrs } from 'vue'
import Client from './Client.js'

export { default as Client } from './Client.js'

export function useApi(apiClasses) {
  let retval = {}
  if (typeof apiClasses == 'object') {
    Object.keys(apiClasses).forEach(key => {
      retval[key] = new apiClasses[key]
    })

    return retval
  }

  if (typeof apiClasses == 'function') {
    return new apiClasses()
  }

  console.error(`invalid arguments for '%cuseApi'`, 'color: cyan')
  throw 'Could not initialize http client'
}

export function provideClient(clientName, clientData) {
  const client = new Client(clientData)
  provide(`$_phi_api_${clientName}`, client)
}

export function getClient(clientName) {
  const injected = inject(`$_phi_api_${clientName}`, null)
  if (injected) {
    return injected
  }

  // Buscar en attrs
  const attrs = useAttrs()
  if (attrs?.[`api-${clientName}`]) {
    return attrs?.[`api-${clientName}`]
  }

  console.error(`http client '%c${clientName}%c' not provided
You must call provideClient('${clientName}', ...) from your root component
`, 'color: cyan', '')

  throw 'Could not initialize http client'
}