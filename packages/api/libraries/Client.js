// import 'whatwg-fetch'; // polyfill
/*
Cliente HTTP (similar a axios) basado en "fetch"

const instance = new Client({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'},
  parameters: {'_oh': 'snap'}  // default fixed URL parameters
});

let people = await instance.get('/people');
*/
import JWT from './JWT.js'

export default class Client {
  constructor(options) {

    let defaultOptions = {
      type: null,
      baseURL: '',
      timeout: 1000,
      headers: {},
      parameters: {},
      api: null,
    }

    if (typeof options == 'string') {
      options = { baseURL: options }
    }

    let sanitizedOptions = Object.assign(defaultOptions, options)

    this.baseURL = sanitizedOptions.baseURL
    this.defaultHeaders = sanitizedOptions.headers
    this.defaultParameters = sanitizedOptions.parameters

    this.token = null
    this.payload = null // token's payload
    this.isLoading = false

    this.type = sanitizedOptions.type

    //backwards compatibility
    this.host = this.baseURL
  }

  setDefaultHeader(headerName, headerValue) {
    this.defaultHeaders[headerName] = headerValue
  }

  setDefaultParameter(parameterName, parameterValue) {
    this.defaultParameters[parameterName] = parameterValue
  }

  /* Bearer token */
  setToken(tokenString) {
    if (!tokenString) {
      this.token = null
      this.payload = null
      return {
        token: null,
        payload: null,
      }
    }

    this.payload = JWT.decode(tokenString)
    if (!this.payload) {
      throw 'Invalid token'
    }

    this.token = tokenString
    return {
      token: this.token,
      payload: this.payload,
    }
  }

  buildRequest(url, options = {}) {
    let usingBaseURL = true

    if (url.substring(0, 5) == 'http:' || url.substring(0, 6) == 'https:') {
      url = Client.sanitize(url)
      usingBaseURL = false
    } else {
      url = this.baseURL + '/' + Client.sanitize(url)
    }

    let queryString = Object.assign({}, this.defaultParameters, options.queryString)
    if (Object.keys(queryString).length) {
      url += '?' + Client.serialize(queryString)
    }

    if (options.body && typeof options.body != 'string' && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body)
    }

    var request = new Request(url, options)

    /* Send token in a Authorization header (unless request specifies its own Authorization header) */
    if (usingBaseURL && this.token && (!options || !options.headers || !options.headers.Authorization)) {
      request.headers.set('Authorization', 'Bearer ' + this.token)
    }

    /* Set default headers (without overriding currently set headers) */
    for (let headerName in this.defaultHeaders) {
      if (!options || !options.headers || !options.headers[headerName]) {
        request.headers.set(headerName, this.defaultHeaders[headerName])
      }
    }

    return request
  }

  fetch(url, options) {
    url = Client.sanitize(url)
    var request = this.buildRequest(url, options)

    var timer = setTimeout(() => {
      this.isLoading = true
    }, 100)

    return fetch(request)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((json) => {
            console.log('fetch error', response)
            throw { body: json, status: response.status, statusText: response.statusText }
          })
        }
        return response
      })
      .finally(() => {
        clearTimeout(timer)
        this.isLoading = false
      })
  }

  get(url, data) {
    return this.fetch(url, {
      method: 'GET',
      queryString: data,
    })
      .then((response) => Client.toJSON(response))
  }

  post(url, data, thirdArg) {
    return this.fetch(url, {
      method: 'POST',
      body: typeof thirdArg != 'undefined' ? thirdArg : data,
      queryString: typeof thirdArg != 'undefined' ? data : null,
    })
      .then((response) => Client.toJSON(response))
  }

  put(url, data, thirdArg) {
    return this.fetch(url, {
      method: 'PUT',
      body: typeof thirdArg != 'undefined' ? thirdArg : data,
      queryString: typeof thirdArg != 'undefined' ? data : null,
    })
      .then((response) => Client.toJSON(response))
  }

  delete(url, data, thirdArg) {
    return this.fetch(url, {
      method: 'DELETE',
      body: typeof thirdArg != 'undefined' ? thirdArg : data,
      queryString: typeof thirdArg != 'undefined' ? data : null,
    })
      .then((response) => Client.toJSON(response))
  }

  patch(url, data, thirdArg) {
    return this.fetch(url, {
      method: 'PATCH',
      body: typeof thirdArg != 'undefined' ? thirdArg : data,
      queryString: typeof thirdArg != 'undefined' ? data : null,
    })
      .then((response) => Client.toJSON(response))
  }

  options(url, data) {
    return this.fetch(url, {
      method: 'OPTIONS',
      body: data,
    })
      .then((response) => Client.toJSON(response))
  }

  static toJSON(response) {
    return response.json().catch((err) => {
      console.error('Could not parse JSON from response', err)
      return null
    })
  }

  static sanitize(url) {
    return url.replace(/^\/+|\/+$/g, '')
  }

  static serialize(obj, prefix) {
    var str = []
    for (var p in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, p)) {
        var k = prefix ? prefix + '[' + p + ']' : p
        var v = obj[p]

        if (v == null) {
          continue
        }

        if (typeof v == 'object') {
          str.push(Client.serialize(v, k))
        } else if (typeof v == 'number' || v.length > 0) {
          str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v))
        }
      }
    }

    return str.join('&')
  }

}