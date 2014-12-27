/*
 * kast
 *
 * Copyright(c) 2014 André König <andre.koenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@posteo.de>
 *
 */

'use strict';

var debug = require('debug')('kast:Kast');
var mandatory = require('mandatory');
var VError = require('verror');

var socket = require('./socket');
var request = require('./request');
var response = require('./response');
var router = require('./router');

module.exports = function initialize () {
    var kast = new Kast();

    return {
        command: kast.command.bind(kast),
        listen: kast.listen.bind(kast)
    };
};

function Kast () {
    // Will be set in the `listen` method.
    this.$socket = null;

    this.$router = router();
}

Kast.prototype.$dispatch = function $dispatch (message, rinfo) {
    var req = request(message, rinfo);
    var res = response(req, this.$socket);

    if (!req) {
        return debug('Received invalid request.');
    }

    this.$router.exec(req.command, req, res);
};

Kast.prototype.command = function command (commandName, handler) {
    this.$router.mount(commandName, handler);
};

Kast.prototype.listen = function listen (port, host, callback) {
    var options = {};

    mandatory(port).is('number', 'Please define a port for the multicast socket.');
    
    function onListen (err) {
        if (err) {
            return callback(new VError(err, 'Unable to create multicast socket.'));
        }

        debug('Bound socket.');

        callback(null);
    }

    if ('function' === typeof host) {
        callback = host;
        host = null;
    }

    options.host = host || '224.1.1.1';
    options.port = port;
    options.dispatcher = this.$dispatch.bind(this);

    callback = callback || function noop () {};

    if (this.$socket) {
        // TODO: Close socket
    }

    this.$socket = socket(options);
    this.$socket.open(onListen);

    return this.$socket;
};