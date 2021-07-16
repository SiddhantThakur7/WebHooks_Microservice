"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

//  const hookList = [
//     {id: 1, uri: 'Sharknado'},
//     {id: 2, uri: 'Roma'},
// ];

const mongoose = require('mongoose');
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
				uri: "string"
			},
			async handler(ctx) {
				return this.saveWebHook(ctx.params.uri)
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
			async handler() {
				return this.listWebHook()
					.then(result => result)
					.catch(error => error);
			}
		},
		trigger: {
			rest: {
				method: "POST",
				path: "/trigger"
			},
			async handler(ctx) {
				return hookList;
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		saveWebHook(url) {
			const hook = new Webhook({
				target_url: url
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

		listWebHook() {
			return new Promise((resolve, reject) => {
				Webhook.find()
					.then((docs) => resolve(docs))
					.catch((err) => reject(err));
			})
		},

		deleteWebHook(h_id) {
			return new Promise((resolve, reject) => {
				Webhook.findOneAndRemove({'_id': h_id})
				.then((doc) => {
					if(!doc){
						reject({message: "The web hook does not exist."});
					}
					resolve({message: "The webhook is deleted successfully."})
				})
				.catch((err) => reject({message: "The web hook could not be deleted", error: err}));
			});
		}
	},


	/**
	 * Service created lifecycle event handler
	 */
	created() {},

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
