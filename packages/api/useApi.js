import { inject } from 'vue'

export default function useApi(apiSpec, wrapperBuilder = null) {
  const client = obtainClient(apiSpec)
  if (!client) {
    throw 'cannot determine client'
  }

  return wrapClient(client, wrapperBuilder)
}

function obtainClient(apiSpec) {
  const injectedClients = inject('$useApi')
  let found = injectedClients.find((client) => client.type == apiSpec?.type)
  if (found) {
    return found
  }

  /// buscar en otro lado?  props?
  return undefined
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
