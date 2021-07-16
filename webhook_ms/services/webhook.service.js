"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

 const hookList = [
    {id: 1, uri: 'Sharknado'},
    {id: 2, uri: 'Roma'},
];

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
				return `${ctx.params.uri}`;
			}
		},
		update: {
			rest: {
				method: "PUT",
				path: "/update"
			},
			params: {
				hook_id: "string",
				uri: "string"
			},
			async handler(ctx) {
				return `${ctx.params.uri} and ${ctx.params.hook_id}`;
			}
		},
		list: {
			rest: {
				method: "GET",
				path: "/list"
			},
			async handler(ctx) {
				return hookList;
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
		
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

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
};
