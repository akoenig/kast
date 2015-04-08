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

var net = require('net');

var debug = require('debug')('kart:Broadcast');
var mandatory = require('mandatory');
var VError = require('verror');

var socket = require('./socket');
var protocol = require('./protocol')();

/**
 *
 * Provides an interface for sending a multicast request.
 *
 * @param {object} options
 * Broadcast request options. An example:
 *
 *     `port`: The multicast port on which the other clients are listening.
 *     `command`: The command which should be executed on the client's side.
 *
 *     `body`: (optional) The request body that should be passed to the client's command handler.
 *     `timeout`: (optional; default: 2000) The timeout after which the broadcast should stop waiting for responses.
 *
 *     `host`: (optional; default: '224.1.1.1') The multicast group ip address.
 *
 * @param {function} callback
 * Will be executed when the responses has been collected. Executed as `callback(err, results)`
 * whereas results is an {array} that contains the ip address of the remote host as key
 * and the response body as value. Example:
 *
 *     {
 *         '192.168.178.0.65': '{"uptime": "20h"}',
 *         '192.168.178.0.12': '{"uptime": "47h"}'
 *     }
 *
 */
module.exports = function broadcast (options, callback) {
    var bcast;

    mandatory(options).is('object', 'Please provide a broadcast configuration object.');
    mandatory(options.port).is('number', 'Please provide a port of the remote multicast sockets.');
    mandatory(options.command).is('string', 'Please provide a command which should be executed.');

    mandatory(callback).is('function', 'Please provide a proper callback function.');

    if (options.body) {
        mandatory(options.body).is('string', 'Please make sure that the request body is a string.');
    }

    options.timeout = options.timeout || 2000;

    bcast = new Broadcast(options);

    bcast.spread(callback);
};

function Broadcast (options) {
    var hrtime = process.hrtime();

    this.$timeout = options.timeout;

    this.$dto = {
        id: Date.now().toString() + hrtime[0] + hrtime[1],
        command: options.command,
        body: options.body
    };

    //
    // Save the port of the multicast group.
    // This broadcast will create a separate socket on a random port.
    //
    this.$remotePort = options.port;
    this.$host = options.host;
}

/**
 * @private
 *
 * Helper method which determines an open port on this host.
 *
 * @param {function} callback
 * Will be executed as `callback(err, port)`.
 *
 */
Broadcast.prototype.$getRandomPort = function $getRandomPort (callback) {
    var range = [49152, 65535];

    function roll () {
        return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
    }

    (function getPort (cb) {
        var port = roll();
        var server = net.createServer();

        range = range + 1;

        server.listen(port, function onListen () {
            server.once('close', function onClose () {
                return cb(null, port);
            });

            server.close();
        });
        server.on('error', function onError () {
            getPort(cb);
        });
    })(callback);
};

/**
 * Sends the actual broadcast request over the wire. The method will create a
 * separate socket in order to not interfere with a possible multicast socket.
 *
 * @param {function} callback
 * Will be executed when the defined timeout has reached. Will be executed as
 * `callback(err, results)` whereas `results` provides the following exemplary structure:
 *
 *     {
 *         '192.168.178.0.65': '{"uptime": "20h"}',
 *         '192.168.178.0.12': '{"uptime": "47h"}'
 *     }
 *
 */
Broadcast.prototype.spread = function spread (callback) {
    var self = this;
    var sock = null;
    var results = {};

    function onMessage (buffer, rinfo) {
        var response = protocol.parse('response', buffer);

        if (response.id === self.$dto.id) {
            results[rinfo.address] = response.body;
        }
    }

    function onClose () {
        debug('Port closed.');

        callback(null, results);
    }

    function onTimeout () {
        debug('Timeout.');

        sock.close(onClose);
    }

    function onOpen (err) {
        var request = null;

        if (err) {
            return callback(new VError(err, 'Failed to open the socket for broadcasting.'));
        }

        debug('Port opened.');

        request = new Buffer(protocol.serialize('request', self.$dto));

        sock.send(request, self.$remotePort);

        debug('Sent request. Waiting for responses (%dms).', self.$timeout);

        setTimeout(onTimeout, self.$timeout);
    }

    function onRandomPort (err, port) {
        var options = {};

        if (err) {
            return callback(new VError(err, 'Failed to grab a new random port for the broadcast socket.'));
        }

        debug('Fetched a new random port at %d', port);

        options.host = self.$host;
        options.port = port;

        options.dispatcher = onMessage;

        sock = socket(options);
        sock.open(onOpen);
    }

    this.$getRandomPort(onRandomPort);
};
