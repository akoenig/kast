/*
 * meeting
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
var ip = require('ip');

var marshaller = require('./marshaller')();

module.exports = Meeting;

function Meeting () {
    this.$ipaddress = ip.address();

    this.$multicast = process.env.MULTICAST_ADDRESS || '224.1.1.1';
    this.$port = process.env.PORT || 60000;
    
    //
    // Will be initialized when attending a meeting.
    //
    this.$socket = null;
    this.$name = null;
}

Meeting.prototype.$dispatch = function $dispatch (body, remote) {
    var command = null;

    if (this.$ipaddress !== remote.address) {
        command = marshaller.deserialize(body.toString('utf8'));
        
        switch (command.name) {
            case 'WHOIS':
                if (this.$name === command.payload) {
                    this.$send(this.$ipaddress);
                }
            break;
        }
    }
};

/**
 * @private
 * 
 * Wrapper around the socket's send method.
 * 
 * @param {String} message
 * The message to send.
 * 
 */
Meeting.prototype.$send = function $send (message) {
    var payload = new Buffer(message);

    this.$socket.send(payload, 0, payload.length, this.$port, this.$multicast);
};

Meeting.prototype.attend = function attend (name, callback) {
    var self = this;

    this.$name = name;

    function onError (err) {
        // TODO: Inherit from EventEmitter
        return console.log(err);
    }

    function onReady () {
        self.$socket.setBroadcast(true);
        self.$socket.setMulticastTTL(128);
        self.$socket.addMembership(self.$multicast);

        callback(null);
    }

    //
    // Init the socket
    //
    this.$socket = dgram.createSocket('udp4');
    this.$socket.on('listening', onReady);
    this.$socket.on('message', this.$dispatch.bind(self));
    this.$socket.on('error', onError);
    this.$socket.bind(this.$port);
};

Meeting.prototype.lookup = function lookup (name, callback) {
    var message = new Buffer(name);
    this.$socket.send(message, 0, message.length, this.$port, this.$multicast);
};

Meeting.prototype.bye = function bye () {};