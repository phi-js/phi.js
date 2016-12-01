import 'whatwg-fetch';
import Cache from './Cache.js';
import Collection from './Collection.js';

export default class Client {

	constructor(host) {
		this.host           = host;
		this.token          = null;
		this.cache          = new Cache;
		this.isLoading      = false;
		this.cacheIsEnabled = true;
	}

	collection(url) {
		return new Collection(this, url);
	}

	/* Bearer token */
	setToken(tokenString) {
		this.token = tokenString;
	}

	fetch (url, options) {
		url        = this.host + "/" + url;
		var method = options.method ? options.method.toLowerCase(): "get";

		/* Convert body into URL params for get requests */
		if (method == "get" && options.body) {
			url += "?" + Client.serialize(options.body);
			options.body = null;
		}

		if (options.body && typeof options.body != "string" && !(options.body instanceof FormData)) {
			options.body = JSON.stringify(options.body);
		}

		var request = new Request(url, options);
		if (this.token) {
			request.headers.set("Authorization", "Bearer " + this.token);
		}

		var promise;
		this.isLoading = true;
		if (method == "get" && this.cacheIsEnabled) {
			promise = this.cache.fetch(request)
				.then((response) => response != undefined ? response : fetch(request))
				.then((response) => this.cache.store(request, response));
		} else {
			this.cache.clear(url);
			promise = fetch(request);
		}

		return promise
			.then(response => {
				this.isLoading = false;
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.json();
			});
	}

	/* Clear the cache for the given URL */
	clear(url) {
		url = this.host + "/" + url;
		return this.cache.clear(url);
	}

	get(url, data) {
		return this.fetch(url, {
			method: "GET",
			body:   data
		});
	}

	post(url, data) {
		return this.fetch(url, {
			method: "POST",
			body:   data
		});
	}

	put(url, data) {
		return this.fetch(url, {
			method: "PUT",
			body:   data
		});
	}

	delete(url, data) {
		return this.fetch(url, {
			method: "DELETE",
			body:   data
		});
	}

	patch(url, data) {
		return this.fetch(url, {
			method: "PATCH",
			body:   data
		});
	}

	options(url, data) {
		return this.fetch(url, {
			method: "OPTIONS",
			body:   data
		});
	}

	static serialize(obj, prefix) {
		var str = [];
		for(var p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + '[' + p + ']' : p;
				var v = obj[p];

				if (v == null) {
					continue;
				}

				if (typeof v == 'object') {
					str.push(serialize(v, k));
				} else if (typeof v == 'number' || v.length > 0) {
					str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
				}
			}
		}

		return str.join('&');
	}

}


/*

For the future:
fetch doesn't support progress events, so we need to implement an upload method using XMLHttpRequest

var xhr = new XMLHttpRequest()
xhr.open('POST', '/uploads')
xhr.onload = function() {
}
xhr.onerror = function() {}
xhr.upload.onprogress = function (event) {
  if (event.lengthComputable) {
    var percent = Math.round((event.loaded / event.total) * 100)
  }
}

*/