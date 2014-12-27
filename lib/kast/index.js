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

var mandatory = require('mandatory');
var VError = require('verror');

var socket = require('./socket');

module.exports = function initialize () {
    var kast = new Kast();
    
    return {
        command: kast.command.bind(kast),
        listen: kast.command.bind(kast)
    };
};

function Kast () {
    
    // Will be set in the `listen` method.
    this.$socket = null;
}

Kast.prototype.command = function command () {};

Kast.prototype.listen = function listen (port, host, callback) {

    mandatory(port).is('number', 'Please define a port for the multicast socket.');
    
    function onListen (err) {
        if (err) {
            return callback(new VError(err, 'Unable to create multicast socket.'));
        }
        
        callback(null);
    }

    if ('function' === typeof host) {
        callback = host;
        host = null;
    }

    host = host || '224.1.1.1';
    callback = callback || function noop () {};

    if (this.$socket) {
        // TODO: Close socket
    }

    this.$socket = socket(port, host);
    this.$socket.open(onListen);

    return this.$socket;
};