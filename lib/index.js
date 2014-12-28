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
var broadcast = require('./broadcast');

module.exports = function initialize () {
    var kast = new Kast();

    //
    // Prepare the front-facing API.
    //
    return {
        command: kast.command.bind(kast),
        listen: kast.listen.bind(kast)
    };
};

module.exports.broadcast = broadcast;

function Kast () {
    // Will be set in the `listen` method.
    this.$socket = null;

    this.$router = router();
}

/**
 * @private
 *
 * This dispatcher method will be executed when a new request has been received
 * through the multicast socket. It is responsible for creating the respective
 * request and response object, extracting the intended command and passing the
 * request to the `router` object which is responsible for executing the registered
 * route.
 *
 * @param {Buffer} message
 * The raw buffer message from the multicast socket.
 *
 * @param {object} rinfo
 * Contains client connection details (ip address and remote port)
 *
 */
Kast.prototype.$dispatch = function $dispatch (message, rinfo) {
    var req = request(message, rinfo);
    var res = response(req, this.$socket);

    if (!req) {
        return debug('Received invalid request.');
    }

    this.$router.exec(req.command, req, res);
};

/**
 * Mounts a command handler.
 *
 * Usage example:
 *
 *     app.command('/users', function (req, res) {
 *          res.send('Hello world.');
 *     });
 *
 */
Kast.prototype.command = function command (commandName, handler) {
    this.$router.mount(commandName, handler);
};

/**
 * Listen for incoming requests on this multicast socket.
 *
 * @param {number} port
 * The port on which the multicast socket should be opened.
 *
 * @param {string} host
 * The multicast ip address (optional; default: `224.1.1.1`).
 *
 * @param {string} callback
 * An optional callback which will be executed when the socket has been opened.
 * Executed as `callback(err)`.
 *
 */
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

    if (typeof host === 'function') {
        callback = host;
        host = null;
    }

    // TODO: Implement additional check if the passed `host` represents
    // a valid multicast ip address.
    options.host = host;
    options.port = port;
    options.dispatcher = this.$dispatch.bind(this);

    callback = callback || function noop () {};

    if (this.$socket) {
        this.$socket.close();
    }

    this.$socket = socket(options);
    this.$socket.open(onListen);
};
