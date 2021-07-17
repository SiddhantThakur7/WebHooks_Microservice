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

	settings: {
		// PORT OF OPERATION
		port: process.env.PORT || 8080,

		// Granting cross origin requests
		cors: {
			methods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
			origin: "*",
		},

		routes: [{
			path: "",
			// Enable/disable parameter merging method
			mergeParams: true,

			// Copnfiguring body parsers to parse request data
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
			logging: false
		}],
	},
	
	events:{
		// Log when data base connection is established.
		"db.connected"(){
			this.logger.info('Database connection established.');
		}
	},

	/**
	 * Service created lifecycle event handler
	 * Databse connection should be stablished as soon as the API gateway service is created.
	 */
	created() {
		const DB_URI = process.env.MONGODB_URI;
		mongoose.connect(DB_URI)
			.then(result => this.broker.emit("db.connected"))
			.catch(err => console.log(err));
	}

}
