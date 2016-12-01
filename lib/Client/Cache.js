import Dexie from 'dexie'

export default class Cache {

	constructor (id) {
		this.id = id ? id : "phidias.cache-2";
		this.createDB();
	}

	createDB () {
		this.db = new Dexie(this.id);
		this.db.version(1).stores({
			request: "hash, url, timestamp"
		});
	}

	empty () {
		return this.db.delete().then(() => this.createDB());
	}

	destroy () {
		return this.db.delete();
	}

	fetch (request) {

		if (!this.db) {
			return new Dexie.Promise(function(resolve, reject) {
				resolve();
			});
		}

        var hash = Cache.getHash(request);
		return this.db.request.get(hash).then((result) => result ? Cache.parse(result.response) : undefined);
	}

	store (request, response) {
        var hash = Cache.getHash(request);
		return Cache.stringify(response).then((responseString) => {
			this.db.request.put({
				hash:      hash,
				url:       request.url.split("?")[0],
				timestamp: new Date(),
				response:  responseString
			});

			return response;
		});
	}

	clear (url) {
		return this.db.request.where("url").equals(url).delete();
	}

	static stringify (response) {
		var response = response.clone();
		var allHeaders = {};
		response.headers.forEach((value, headerName) => {
			allHeaders[headerName] = value;
		});

		return response.text().then((text) =>
			JSON.stringify({
				body: text,
				options: {
					status:     response.status,
					statusText: response.statusText,
					headers:    allHeaders
				}
			})
		);
	}

	static parse (responseString) {
		if (!responseString) {
			return responseString;
		}
		var responseData = JSON.parse(responseString);
		return new Response(responseData.body, responseData.options);
	}

    static getHash (request) {
        return 'cache:' + request.url;
    }
}