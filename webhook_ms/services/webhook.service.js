"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

//  const hookList = [
//     {id: 1, uri: 'Sharknado'},
//     {id: 2, uri: 'Roma'},
// ];

const mongoose = require('mongoose');
const PromisePool = require('@supercharge/promise-pool')
const axios = require('axios');
const axiosRetry = require('axios-retry');

const Webhook = require('../Models/webhook.models');

module.exports = {
	name: "webhook",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
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

		listWebHook(uid) {
			return new Promise((resolve, reject) => {
				Webhook.find({'user_id': uid})
					.then((docs) => resolve(docs))
					.catch((err) => reject(err));
			})
		},

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
		
		triggerWebHookAction(ip, uid) {
			return new Promise((resolve, reject) => {
				Webhook.find({'user_id': uid})
				.then((webhooks) => {
					if (!webhooks) {
						reject({
							message: "No webhooks to be triggerred"
						})
					}
					return webhooks;
				})
				.then(async (hooks) => {
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
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
}
