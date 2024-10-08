import Client from './Client.js'
// import { provide } from 'vue'

export const registeredFinders = []
export const registeredClients = {}

export default function provideClient(clientType, clientData = null) {
  if (typeof clientType === 'function') {
    registeredFinders.push(clientType)
    return
  }

  const client = new Client(clientData)

  if (!registeredClients[clientType]) {
    registeredClients[clientType] = []
  }
  registeredClients[clientType].push(client)
  // provide(`$_phi_api_${clientType}`, client)
}
