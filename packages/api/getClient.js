import { inject, useAttrs } from 'vue'
import { registeredFinders } from './provideClient.js'

export default function getClient(clientType) {
  /*
  Look for clients of type clientType registered via
  registerClientFinder(finderCallbak)
  */
  if (registeredFinders?.length) {
    for (let i = 0; i < registeredFinders.length; i++) {
      const foundHttpClient = registeredFinders[i]?.(clientType)
      if (foundHttpClient) {
        return foundHttpClient
      }
    }
  }

  const injected = inject(`$_phi_api_${clientType}`, null)
  if (injected) {
    return injected
  }

  // Buscar en attrs
  const attrs = useAttrs()
  if (attrs?.[`api-${clientType}`]) {
    return attrs?.[`api-${clientType}`]
  }

  console.error(`http client '%c${clientType}%c' not provided
You must call provideClient('${clientType}', ...) from your root component
`, 'color: cyan', '')

  throw 'Could not initialize http client'
}