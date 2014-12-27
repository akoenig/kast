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

var dgram = require('dgram');

var debug = require('debug')('kast:Socket');

var ip = require('ip');

module.exports = function initialize (port, host) {
    var socket = new Socket(port, host);

    return {
        open: socket.open.bind(socket),
        close: socket.close.bind(socket)
    };
};

/**
 * Wrapper around the socket implementation of Node.js with some
 * proxy functionality around incoming messages.
 * 
 * Emits:
 * 
 *   - message
 * 
 */
function Socket (options) {
    this.$ipaddress = ip.address();

    this.$port = options.port;
    this.$host = options.host;
    this.$ttl = options.ttl || 128;
    this.$dispatcher = options.dispatcher;

    //
    // Will be filled on socket opening:
    //

    // The native socket implementation.
    this.$impl = null;
}

Socket.prototype.$message = function $message (message, rinfo) {
    //
    // Only emit the messages that comes from a different host.
    //
    if (rinfo.address !== this.$ipaddress) {
        this.$dispatcher(message, rinfo);
    }
};

Socket.prototype.open = function open (callback) {
    var self = this;

    function onListening () {
        self.$impl.setBroadcast(true);
        self.$impl.setMulticastTTL(self.$ttl);
        self.$impl.addMembership(self.$host);
        
        debug('Bound the port.');
        
        callback(null);
    }

    debug('Opening the multicast socket.');

    this.$impl = dgram.createSocket('udp4');

    this.$impl.on('listening', onListening);
    this.$impl.on('message', this.$message.bind(this));

    this.$impl.bind(this.$port);
};

Socket.prototype.close = function close () {
    this.$impl.close();
};