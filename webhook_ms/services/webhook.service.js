"use strict";
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const mongoose = require('mongoose');
const PromisePool = require('@supercharge/promise-pool')
const axios = require('axios');
const axiosRetry = require('axios-retry');

const Webhook = require('../Models/webhook.models');

module.exports = {
	name: "webhook",
	/**
	 * Actions
	 */
	actions: {

		/**
		 * Saves a new webhook with its taget url and user_id in the database.
		 * @params -> targetUrl(uri) {String}, user_id {String}
		 * @returns -> Unique id which is saved with the targetUrl {String}
		 */
		register: {
			rest: {
				method: "POST",
				path: "/register"
			},
			params: {
				uri: "string",
				user_id: "string"
			},
			async handler(ctx) {
				console.log(ctx.params.user_id);
				return this.saveWebHook(ctx.params.uri, ctx.params.user_id)
					.then((hook_id) => hook_id)
					.catch(err => err);
			}
		},

		/**
		 * Updates a webhook's taget url already saved in the database given the unique id of the webhook.
		 * @params -> id {String}, newTargetUrl(uri) {String}
		 * @returns -> Unique id of the updated webhook if an update was made else null.
		 */
		update: {
			rest: {
				method: "PUT",
				path: "/update"
			},
			params: {
				id: "string",
				uri: "string"
			},
			async handler(ctx) {
				console.log(ctx.params);
				return this.updateWebHook(ctx.params.id, ctx.params.uri)
					.then((result) => result)
					.catch((error) => error);
			}
		},

		/**
		 * Deletes a webhook along with its taget url that is saved in the database given the unique id of the webhook.
		 * @params -> id {String}
		 * @returns -> null
		 */
		delete: {
			rest: {
				method: "DELETE",
				path: "/update"
			},
			params: {
				id: "string",
			},
			async handler(ctx) {
				return this.deleteWebHook(ctx.params.id)
					.then((result) => result)
					.catch((error) => error);
			}
		},

		/**
		 * Extracts all the webhooks of a user from the database.
		 * @params -> user_id {String}
		 * @returns -> [{Object}]
		 */
		list: {
			rest: {
				method: "GET",
				path: "/list"
			},
			params: {
				user_id: "string"
			},
			async handler(ctx) {
				return this.listWebHook(ctx.params.user_id)
					.then(result => result)
					.catch(error => error);
			}
		},

		/**
		 * Extracts all the webhooks of a user. Use the list to make POST requests to the targetUrl(s).
		 * @params -> user_id {String}, Ip address of the user(ip) {String}
		 * @returns -> [{Object}]
		 */
		trigger: {
			rest: {
				method: "POST",
				path: "/trigger"
			},
			params: {
				ip: "string",
				user_id: "string"
			},
			async handler(ctx) {
				return this.triggerWebHookAction(ctx.params.ip, ctx.params.user_id)
					.then(result => result)
					.catch(error => error);
			}
		}
	},

	/**
	 * Events
	 */
	events: {
		"webhook.trigger"(payload){
			this.broker.call("webhook.trigger", payload)
    			.then(res => console.log("Outcome: ", res));
		}
	},

	/**
	 * Methods
	 */
	methods: {
		// returns a promise that resolves when the webhook is registered successfully.
		saveWebHook(url, uid) {
			const hook = new Webhook({
				target_url: url,
				user_id: mongoose.Types.ObjectId(uid)
			});
			return new Promise((resolve, reject) => {
				hook.save()
					.then((doc) => {
						resolve(`${doc.id.toString()}`);
					})
					.catch((err) => reject(err));
			})
		},

		// returns a promise that resolves when webhook is updated successfully.
		updateWebHook(h_id, url) {
			return new Promise((resolve, reject) => {
				Webhook.findOneAndUpdate({
						"_id": h_id
					}, {
						target_url: url
					}, {
						new: true
					})
					.then((doc) => {
						console.log(doc);
						if (!doc) {
							reject({
								message: "The requested webhook does not exist."
							});
						}
						resolve({
							message: "The requested webhook is successfully updated."
						});
					})
					.catch((err) => reject({
						message: "Some Error Occurred",
						error: err
					}));
			})
		},

		// returns a promise that resolves when all the webhooks pertaining to a user have been extracted.
		listWebHook(uid) {
			return new Promise((resolve, reject) => {
				Webhook.find({'user_id': uid})
					.then((docs) => resolve(docs))
					.catch((err) => reject(err));
			})
		},

		// returns a promise that resolves when the webhook is successfully deleted.
		deleteWebHook(h_id) {
			return new Promise((resolve, reject) => {
				Webhook.findOneAndRemove({
						'_id': h_id
					})
					.then((doc) => {
						if (!doc) {
							reject({
								message: "The web hook does not exist."
							});
						}
						resolve({
							message: "The webhook is deleted successfully."
						})
					})
					.catch((err) => reject({
						message: "The web hook could not be deleted",
						error: err
					}));
			});
		},
		
		// returns a promise that resolves when all the webhooks pertaining to a user have been extracted and trigerred. 
		// Also makes sure that the failed requests are retried upto 5 times while maintaining the batch execution flow.
		triggerWebHookAction(ip, uid) {
			return new Promise((resolve, reject) => {
				this.listWebHook(uid)
				.then((webhooks) => {
					if (!webhooks) {
						reject({
							message: "No webhooks to be triggerred"
						})
					}
					return webhooks;
				})
				.then(async (hooks) => {
					/** 
					 * The Promise pool considers upto 20 requests to paralellize at any given time.
					 * */ 
					const {
						results,
						errors
					} = await PromisePool
					.withConcurrency(20)
					.for(hooks)
					.process(async data => {
						const calls = await axios({
							method: 'POST',
							url: data.target_url,
							data: {
								ip: ip,
								timestamp: data.createdAt.toString(),
							}
						})
						.then((response) => {
							console.log(response.data);
							return response.data;
						})
						return calls;
					})
					return {res:results, errs: errors}
				})
				.then((outcome) => {
					console.log('outcome =====', outcome);
					resolve(outcome);
				})
				.catch((err) => reject({
					message: "The web hooks could not be triggerred.",
					error: err
				}))
			});
		}
	},

	/**
	 * Service created lifecycle event handler
	 * The interceptor is instantiated as soon as the service is created.
	 * Retries every request with statusCode != 200 about 5 times while maintaining the batch execution flow.
	 */
	created() {
		axiosRetry(axios, {
			retries: 5, // number of retries
			retryDelay: (retryCount) => {
			  console.log(`retry attempt: ${retryCount}`);
			  return retryCount * 200; // time interval between retries
			},
			retryCondition: (error) => {
			  // if retry condition is not specified, by default idempotent requests are retried
			  return error.response.status != 200;
			},
		  });
	}
}
