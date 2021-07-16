"use strict";

const ApiGateway = require("moleculer-web");
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
if (process.env.NODE_ENV != "production") require('dotenv').config();

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 8080,

		cors: {
			methods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
			origin: "*",
		},

		routes: [{
			path: "",

			// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
			mergeParams: true,


			bodyParsers: {
				json: {
					strict: false,
					limit: "1MB"
				},
				urlencoded: {
					extended: true,
					limit: "1MB"
				}
			},

			// Enable/disable logging
			logging: true
		}],
		// // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		// log4XXResponses: false,
		// // Logging the request parameters. Set to any log level to enable it. E.g. "info"
		// logRequestParams: null,
		// // Logging the response data. Set to any log level to enable it. E.g. "info"
		// logResponseData: null,


		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
		}
	},

	methods: {
		// initRoutes(app) {
		// 	// app.get('/webhook', this.registerUrl);
		// 	// app.post("/webhook", this.registerUrl);
		// 	// app.put("/webhook", this.updateUrl);
		// 	// app.post("/trigger", this.triggerRequests);
		// 	// app.get('/webhook', this.getList);
	},

	created() {
		const app = express();
		app.use(bodyParser());
		this.app = app;
		const DB_URI = process.env.MONGODB_URI;
		mongoose.connect(DB_URI)
			.then(result => console.log('Connection Established!'))
			.catch(err => console.log(err));
	}
}
