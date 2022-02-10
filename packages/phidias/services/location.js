import { location } from '@/packages/phidias/apis/v4/'
import { useApi } from '@/packages/api/'

export default function useLocation() {
  const $api = useApi({ location });

  return {
    getCountries: () => $api.location.getCountries(),
    getStates: (countryIsoCode) => $api.location.getStates(countryIsoCode),
    getCities: (stateIsoCode) => $api.location.getCities(stateIsoCode),
    toText: (locationObject) => $api.location.toText(locationObject),
  }
}