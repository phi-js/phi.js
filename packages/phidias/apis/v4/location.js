export default function (httpClient) {
  return {
    getCountries() {
      return httpClient.get('/v3/location/countries');
    },

    getStates(countryIsoCode) {
      return httpClient.get('/v3/location/states', { country: countryIsoCode });
    },

    getCities(stateIsoCode) {
      return httpClient.get('/v3/location/cities', { state: stateIsoCode });
    },

    toText(locationObject) {
      return httpClient.get('/v3/location/toString', locationObject);
    },
  }
}