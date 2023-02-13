import { useAttrs } from 'vue'
import { registeredFinders, registeredClients } from './provideClient.js'

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

  if (registeredClients?.[clientType]?.length) {
    return registeredClients[clientType][0]
  }

  // Buscar en attrs
  try {
    const attrs = useAttrs()
    if (attrs?.[`api-${clientType}`]) {
      return attrs?.[`api-${clientType}`]
    }
  } catch (err) {
    // useAttrs error.  Not called inside setup().
  }

  console.error(`http client '%c${clientType}%c' not provided
You must call provideClient('${clientType}', ...) from your root component
`, 'color: cyan', '')

  throw 'Could not initialize http client'
}