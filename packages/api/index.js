import { provide, inject, useAttrs } from 'vue'
import Client from './Client.js'
export { default as Client } from './Client.js'

export function provideApi(apiSpec, apiName = 'client') {
  const client = typeof apiSpec === 'object' ? apiSpec : new Client(apiSpec)
  provide(`$_phi_api_${apiName}`, client)
}

export function useApi(wrapperBuilder = null, apiName = undefined) {
  const client = obtainClient(apiName)
  if (!client) {
    throw 'cannot determine API client'
  }

  return wrapClient(client, wrapperBuilder)
}


function obtainClient(apiName = 'client') {
  const injected = inject(`$_phi_api_${apiName}`, null)
  if (injected) {
    return injected
  }

  // Buscar en attrs
  const attrs = useAttrs()
  return attrs?.[`api-${apiName}`]
}

function wrapClient(client, wrapper) {
  if (!wrapper) {
    throw 'No wrapper specified'
  }

  if (typeof wrapper == 'function') {
    return wrapper(client)
  }

  if (typeof wrapper == 'object') {
    let retval = {}
    for (let prop in wrapper) {
      retval[prop] = wrapClient(client, wrapper[prop])
    }
    return retval
  }

  return undefined
}