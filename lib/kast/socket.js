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
var events = require('events');
var util = require('util');

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
function Socket (port, host, ttl) {
    this.$ipaddress = ip.address();

    this.$port = port;
    this.$host = host;
    this.$ttl = ttl || 128;

    this.$impl = null;

    events.EventEmitter.call(this);
}

util.inherits(Socket, events.EventEmitter);

Socket.prototype.$message = function $message (message, remote) {
    
    //
    // Only emit the messages that comes from a different host.
    //
    if (remote.address !== this.$ipaddress) {
        this.emit('message', message);
    }
};

Socket.prototype.open = function open (callback) {
    var self = this;
    
    function onListening () {
        self.$impl.setBroadcast(true);
        self.$impl.setMulticastTTL(self.$ttl);
        self.$impl.addMembership(self.$host);
        
        callback(null);
    }

    this.$impl = dgram.createSocket('udp4');

    this.$impl.on('listening', onListening);
    this.$impl.on('message', this.$message.bind(this));

    this.$impl.bind(this.$port);
};

Socket.prototype.close = function close () {
    this.$impl.close();
};