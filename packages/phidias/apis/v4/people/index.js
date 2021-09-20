var peopleCache = {};

export default function (httpClient) {
  return {
    getPeopleList(search = null) {
      let params = search ? '?q=' + search : '';
      return httpClient.get('/people' + params);
    },

    getPersonDetails(personId) {
      if (typeof peopleCache[personId] == 'undefined') {
        peopleCache[personId] = httpClient.get('/people/' + personId)
      }

      return peopleCache[personId];
    },

    updatePerson(personId, personData) {
      return httpClient.put('/people/' + personId, personData);
    },

    deletePerson(personId) {
      return httpClient.delete('/people/' + personId);
    },

    /* Audiences */
    getAudiencePeople(audience) {
      return httpClient.post('/sets/people/query', audience)
    }
  }
}