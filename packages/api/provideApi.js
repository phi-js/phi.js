import { provide, reactive } from 'vue'
import Client from './libraries/Client.js'

const providedClients = reactive([])
var isCalled = false

export default function provideApi(apiSpec) {
  const client = new Client(apiSpec)
  providedClients.push(client)
  if (!isCalled) {
    provide('$useApi', providedClients)
    isCalled = true
  }
}
