var pageCache = {};

export default (httpClient) => ({
  getPage(pageId) {
    if (typeof pageCache[pageId] == 'undefined') {
      pageCache[pageId] = httpClient.get(`/1/cms/pages/${pageId}`);
    }

    return pageCache[pageId];
  },

  async getDraft(pageId) {
    let draft = await httpClient.get(`/1/cms/pages/${pageId}/draft`);
    return {
      ...draft,
      id: draft?.id || pageId
    };
  },

  saveDraft(pageId, pageData) {
    pageCache[pageId] = undefined;
    return httpClient.put(`/1/cms/pages/${pageId}/draft`, pageData);
  },

  publish(pageId, pageData = null) {
    return httpClient.put(`/1/cms/pages/${pageId}/publish`, pageData);
  },

  getUrlDetails(url) {
    return httpClient.get(`/1/proxy/url/details`, { url });
  },

  uploadBlob(pageId, fileName, blob) {
    let formData = new FormData();
    formData.append('files', blob, fileName);

    return httpClient.post(`/1/cms/pages/${pageId}/files`, formData);
  },

  // Registro unico por aca persona-página
  obtainRecord(pageId, personId) {
    return httpClient.get(`/1/cms/people/${personId}/pages/${pageId}/record`);
  },

  updateRecord(pageId, personId, recordData) {
    return httpClient.put(`/1/cms/people/${personId}/pages/${pageId}/record`, recordData);
  },

});