import { location } from '@/packages/phidias/apis/v4/'
import { useApi } from '@/packages/api/'

function getApiClient() {
  return useApi(location)
}

export function getCountries() {
  return getApiClient().getCountries()
}

export function getStates(countryIsoCode) {
  return getApiClient().getStates(countryIsoCode)
}

export function getCities(stateIsoCode) {
  return getApiClient().getCities(stateIsoCode)
}

export function toText(locationObject) {
  return getApiClient().toText(locationObject)
}