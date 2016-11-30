import Client from './Client/Client.js';
import JWT from './JWT.js';
import Push from './Push.js';
import Dexie from 'dexie';

export default class App {

	constructor (options) {
		this.options = {
			endpoint:       null,
			title:          null,
			logo:           null,
			googleClientId: null
		};

		this.api       = null;
		this.token     = null;
		this.user      = null;
		this.isLoaded  = false;

		this.listeners = {};

		this.load(options);

		this.breadcrumbs = [];
	}


	/* Breadcrumbs stuff */
	clearCrumbs () {
		this.breadcrumbs = [];
	}

	pushCrumb (node) {
		for (var i = 0; i < this.breadcrumbs.length; i++) {
			if (node.id == this.breadcrumbs[i].id) {
				this.breadcrumbs.splice(i+1);
				return;
			}
		}
		this.breadcrumbs.push(node);
	}


	/* Option getters */
	get endpoint () {
		return this.options.endpoint;
	}

	get title () {
		return this.options.title;
	}

	get logo () {
		return this.options.logo;
	}

	load (options) {
		if (!options) {
			return;
		}

		this.options = Object.assign(this.options, options);

		if (this.options.endpoint) {
			this.api = new Client(this.options.endpoint);
			this.isLoaded = true;
			this.emit("load");
		}
	}

	/* Event handling */
	on (eventName, callback) {
		eventName = eventName.toLowerCase();
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(callback);

		return () => {
			this.listeners[eventName].splice(this.listeners[eventName].indexOf(callback), 1);
		};
	}

	emit (eventName, args) {
		eventName = eventName.toLowerCase();
		if (!this.listeners[eventName]) {
			return;
		}

		this.listeners[eventName].forEach((callback) => {
			callback(args);
		});
	}


	loadCode (code, rackUrl) {

		if (rackUrl == undefined) {
			rackUrl = "https://phidias.io/";
		}

		return new Client(rackUrl)
			.get("/code/" + code)
			.then((response) => {
				this.load({
					title:    response.title,
					logo:     response.logo,
					endpoint: response.url
				});
			});
	}

	get isAuthenticated () {
		return this.token != null;
	}

	setToken (tokenString) {
		this.token = tokenString;
		this.user  = JWT.decode(this.token);

		this.api.setToken(this.token);
		this.registerPushNotifications();
		this.emit("login", this.user);

		return this.user;
	}

	logout () {
		this.user = null;
		this.token = null;
		this.api.setToken(null);

		this.emit("logout");
	}

	login (username, password) {
		return this.api.fetch("oauth/token", {
			method: "post",
			headers: {
				Authorization: 'Basic ' + btoa(username + ':' + password)
			},
			body: {
				grant_type: "client_credentials"
			}
		})
		.then((response) => {
			return this.setToken(response.access_token);
		});
	}

	googleLogin () {
		return new Promise((resolve, reject) => {
			this.getGoogleAuthorizationCode()
				.then((googleCode) => {
					this.api.post("oauth/google", {code: googleCode})
						.then((response) => {
							this.setToken(response.access_token);
							resolve(this.user);
						}, reject);
				}, reject);
		});
	}

	getGoogleAuthorizationCode () {
		// https://developers.google.com/identity/protocols/OAuth2UserAgent#formingtheurl
		var authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + Client.serialize({
			"redirect_uri":  "http://www.phidias.co/googlesignin.html",
			"client_id":     this.options.googleClientId,
			"scope":         "email",
			"response_type": "code",
			"prompt":        "select_account"
		});

		return new Promise(function (resolve, reject) {

			// Open the OAuth consent page in the InAppBrowser
			var authWindow = window.open(authUrl, '_blank');

			// Listen (one time) for messages sent from authWindow
			var listenMessage = function(event) {

				if (event.data.status == 'success') {
					resolve(event.data.code);
				} else {
					reject(event.data.error);
				}

				window.removeEventListener('message', listenMessage);
			}
			window.addEventListener('message', listenMessage);


			// Within phonegap, the created window will NOT have a window.opener, so
			// use this instead:
			authWindow.addEventListener('loadstart', function(e) {
				var url   = e.url;
				var code  = new RegExp(/\?code=(.+)$/).exec(url);
				var error = new RegExp(/\?error=(.+)$/).exec(url);

				var result = {};

				if (code) {
					result.status = 'success';
					result.code   = code[1];
				} else if (error) {
					result.status = 'error';
					result.error  = error[1];
				}

				if (code || error) {
					window.postMessage(result, "*");
					authWindow.close();
				}
			});

		});
	}

	getDataFromMetaTags () {

		var retval = {};

		/* Obtain data from metatags (in public/index.html) */
		var metas = document.querySelectorAll('meta');
		for (var cont = 0; cont < metas.length; cont++) {

			/* Obtain endpoint from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-endpoint") {
				retval.endpoint = metas[cont].content;
			}

			/* Obtain title from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-title") {
				retval.title = metas[cont].content;
			}

			/* Obtain logo from "phi-endpoint" metatag */
			if (metas[cont].name == "phi-logo") {
				retval.logo = metas[cont].content;
			}

			/* Obtain googleClientId from "phi-google-client-id" metatag */
			if (metas[cont].name == "phi-google-client-id") {
				retval.googleClientId = metas[cont].content;
			}

		}

		return retval;
	}


	/* Display a notification. takes same arguments as registration.showNotification */
	displayNotification (title, options) {
		if (!'serviceWorker' in navigator) {
			console.warn("serviceworker not supported");
			return;
		}

		navigator.serviceWorker.getRegistration().then(registration => {
			registration.showNotification(title, options);
		});
	}


	registerPushNotifications (googleClientId) {

		/*
		PushNotification is phonegap's push notification plugin
		When it is not present, the service worker methods are used (via the encapsulating Push class)
		*/
		if (typeof PushNotification == "undefined") {

			Push.subscribe()
				.then(subscription => {
					var subscriptionId = Push.getSubscriptionId(subscription);

					/* Save endpoint data */
					var db = new Dexie("service-worker-data");
					db.version(1).stores({settings: "name"});

					db.settings.put({
						name: "app",
						value: {
							endpoint:       this.api.host,
							authentication: this.token,
							subscriptionId: subscriptionId,
							userId:         this.user.id
						}
					})
					.then(() => {
						/* Register the device with the endpoint */
						this.api.post(`people/${this.user.id}/devices`, {
							token:    subscriptionId,
							platform: "gcm",
							model:    "browser version here soon",
							uuid:     subscriptionId
						});

						/*
						Listen for messages from service worker
						see https://ponyfoo.com/articles/serviceworker-messagechannel-postmessage#broadcasting-from-a-serviceworker-to-every-client
						*/
						if ('serviceWorker' in navigator) {
							navigator.serviceWorker.addEventListener('message', (event) => {
								this.emit("notification", event.data);
							});
						}
					});

				})
				.catch(err => {
					// serviceWorker not supported
				});

			return;
		}

		var push = PushNotification.init({
			android: {
				senderID: googleClientId
			},
			ios: {
				alert: "true",
				badge: "true",
				sound: "true"
			},
			windows: {}
		});

		push.on('registration', (data) => {

			if (!window.device || !window.device.platform) {
				return;
			}

			this.api.post(`people/${this.user.id}/devices`, {
				token:    data.registrationId,
				platform: window.device.platform,
				model:    window.device.model,
				uuid:     window.device.uuid
			});

		});

		push.on('notification', (data) => {
			// data.message,
			// data.title,
			// data.count,
			// data.sound,
			// data.image,
			// data.additionalData

			// window.dispatchEvent(new CustomEvent("phiNotification", {detail:data}));
			this.emit("notification", data);
		});

		push.on('error', function(e) {
			alert(e.message);
		});

	}

}