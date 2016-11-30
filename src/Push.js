/*
Based on
https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications
*/

var Push = {

	subscribe () {

		if (!('serviceWorker' in navigator)) {
			return new Promise((resolve, reject) => {
				reject("serviceWorker is not supported");
			});
		}

		return navigator.serviceWorker.ready
			.then(serviceWorkerRegistration => {
				return serviceWorkerRegistration.pushManager
					.subscribe({userVisibleOnly: true})
					.then(subscription => {
						console.log("subscription OK", subscription);
						// TODO: Send the subscription subscription.endpoint
						// to your server and save it to send a push message
						// at a later date
						// return sendSubscriptionToServer(subscription);
						return subscription;
					})
					.catch(function(e) {
						console.log("subscription Error", e);
						if (Notification.permission === 'denied') {
							// The user denied the notification permission which
							// means we failed to subscribe and the user will need
							// to manually change the notification permission to
							// subscribe to push messages
							console.log('Permission for Notifications was denied');
						} else {
							// A problem occurred with the subscription, this can
							// often be down to an issue or lack of the gcm_sender_id
							// and / or gcm_user_visible_only
							console.log('Unable to subscribe to push.', e);
						}
					});
			});
	},

	unsubscribe () {

		if (!('serviceWorker' in navigator)) {
			return new Promise((resolve, reject) => {
				reject("serviceWorker is not supported");
			});
		}

		return navigator.serviceWorker.ready
			.then(serviceWorkerRegistration => {
				// To unsubscribe from push messaging, you need get the
				// subcription object, which you can call unsubscribe() on.
				serviceWorkerRegistration.pushManager
					.getSubscription()
					.then(pushSubscription => {
						// Check we have a subscription to unsubscribe
						if (!pushSubscription) {
							// No subscription object
							return;
						}

						// TODO: Make a request to your server to remove
						// the users data from your data store so you
						// don't attempt to send them push messages anymore

						// We have a subcription, so call unsubscribe on it
						pushSubscription
							.unsubscribe()
							.then(function() {
								// Successful unsubscription
							})
							.catch(function(e) {
								// We failed to unsubscribe, this can lead to
								// an unusual state, so may be best to remove
								// the subscription id from your data store and
								// inform the user that you disabled push
								console.log('unsubscription error: ', e);
							});
					})
					.catch(function(e) {
						window.Demo.debug.log('Error thrown while unsubscribing from ' + 'push messaging.', e);
					});
			});
	},

	// This method handles the removal of subscriptionId
	// in Chrome 44 by concatenating the subscription Id
	// to the subscription endpoint
	getFullEndpoint (pushSubscription) {
		// Make sure we only mess with GCM
		if (pushSubscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {
			return pushSubscription.endpoint;
		}

		var mergedEndpoint = pushSubscription.endpoint;
		// Chrome 42 + 43 will not have the subscriptionId attached
		// to the endpoint.
		if (pushSubscription.subscriptionId &&
			pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
			// Handle version 42 where you have separate subId and Endpoint
			mergedEndpoint = pushSubscription.endpoint + '/' +
			pushSubscription.subscriptionId;
		}
		return mergedEndpoint;
	},

	getSubscriptionId (pushSubscription) {
		var endpointSections = Push.getFullEndpoint(pushSubscription).split('/');
		return endpointSections[endpointSections.length - 1];
	}

};

export default Push