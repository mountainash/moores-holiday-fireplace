#!/bin/env node

var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var holiday = require('./holiday');
var gametick = require('./game');
var ticking  = 0;

var GameOfLightsApp = function() {

    var self = this;

    self.setupVariables = function() {
        //  Set the environment variables 
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };

    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content
        self.zcache['index.html'] = fs.readFileSync('public/index.html');
    };


    self.cache_get = function(key) { return self.zcache[key]; };

    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };

    self.setupTerminationHandlers = function(){
        //  Process on exit and signals
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    self.postWorld = function(req, res) {
        if (ticking) { 
            clearTimeout(ticking);
            ticking = null;
        }
        var startPattern = req.body.pattern;
        var host = req.body.host;
        var tickDelay = req.body.delay || "1000";
        var aliveColour = req.body.alive || "#360A5E";
        var deadColour = req.body.dead || "#000000";

        holiday.init(host, aliveColour, deadColour);
        res.sendStatus(200);
        console.log('Sending pattern to Holiday');
        self.doTick(startPattern, tickDelay);  
    };

    self.getHome = function(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.send(self.cache_get('index.html') );
    };

    self.initializeServer = function() {
        self.app = express();
        self.app.use(express.static(path.join(__dirname, '/')));
        self.app.use(bodyParser.urlencoded({ extended: false }));
        self.app.use(bodyParser.json());
        self.app.get('/', self.getHome);
        self.app.post('/holiday', self.postWorld);
    };

    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        self.initializeServer();
    };

    self.start = function() {
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

    self.doTick = function(world, delay) {
        // Add the unused light at the start of the string
        var render = [false].concat(world);
        holiday(render);
        ticking = setTimeout(function() { 
            self.doTick(gametick(world), delay);
        }, delay);
    }
};   

var zapp = new GameOfLightsApp();
zapp.initialize();
zapp.start();
