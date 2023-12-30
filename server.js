#!/bin/env node

const express = require('express'),
	fs = require('fs'),
	path = require('path'),
	bodyParser = require('body-parser'),
	sendLights = require('./holiday');

const ipholiday_default = '192.168.178.24';

var GameOfLightsApp = function () {

	var self = this;

	//  Set the environment variables
	self.ipaddress = process.env.NODEJS_IP || '127.0.0.1';
	self.port = Number(process.env.NODEJS_PORT) || 8080;
	self.ipholiday = process.env.HOLIDAY_IP || ipholiday_default;


	self.populateCache = function () {
		if (typeof self.zcache === "undefined") {
			self.zcache = { 'index.html': '' };
		}

		function replaceIP(htmlstring) {
			return htmlstring.replace(new RegExp(ipholiday_default, 'g'), self.ipholiday);
		}

		//  Local cache for static content
		let index = fs.readFileSync('public/index.html', 'utf8');
		self.zcache['index.html'] = replaceIP( index );
	};

	self.cache_get = function (key) { return self.zcache[key]; };

	self.terminator = function (sig) {
		if (typeof sig === "string") {
			console.warn('%s: Received %s - terminating sample app ...', new Date().toLocaleString(), sig);
			process.exit(1);
		}
		console.warn('%s: Node server stopped.', new Date().toLocaleString());
	};

	self.setupTerminationHandlers = function () {
		//  Process on exit and signals
		process.on('exit', function () { self.terminator(); });

		// Removed 'SIGPIPE' from the list - bugz 852598
		['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
		].forEach(function (element, index, array) {
			process.on(element, function () { self.terminator(element); });
		});
	};

	self.postLights = function (req, res) {
		var host = req.body.host,
			startPattern = req.body.pattern;

		console.log('Received pattern', startPattern);
		res.sendStatus(200);
		console.log('Sending pattern to Holiday', host);

		// set the "bonus" light, at the start of the string, equal to the cell (see README Notes)
		if (startPattern.length === 49) {
			startPattern = [startPattern[0]].concat(startPattern);
		}
		holiday(host, startPattern);
	};

	self.getHome = function (req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(self.cache_get('index.html'));
	};

	self.initializeServer = function () {
		self.app = express();
		self.app.use(express.static(path.join(__dirname, '/')));
		self.app.use(bodyParser.urlencoded({ extended: false }));
		self.app.use(bodyParser.json());
		self.app.get('/', self.getHome);
		self.app.post('/holiday', self.postLights);
	};

	self.initialize = function () {
		self.populateCache();
		self.setupTerminationHandlers();

		self.initializeServer();
	};

	self.start = function () {
		self.app.listen(self.port, self.ipaddress, function () {
			console.info('%s: Node server started on %s:%d ...', new Date().toLocaleString(), self.ipaddress, self.port);
		});
	};
};

var zapp = new GameOfLightsApp();
zapp.initialize();
zapp.start();