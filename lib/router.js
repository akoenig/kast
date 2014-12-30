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

var debug = require('debug')('kast:Router');

module.exports = function instantiate () {
    var router = new Router();

    return {
        mount: router.mount.bind(router),
        exec: router.exec.bind(router)
    };
};

function Router () {
    this.$routes = {};
}

/**
 * Mounts a handler to a defined command.
 *
 * Example:
 *
 *     app.mount('/users', function (req, res) {...});
 *
 * @param {string} command
 * The name of the command.
 *
 * @param {function} handler
 * A handler function which will be executed when the respective command should
 * be executed. Please note that a `Request` and a `Response` object will be passed
 * to the handler function.
 *
 */
Router.prototype.mount = function mount (command, handler) {
    this.$routes[command] = handler;

    debug('Mounted %s', command);
};

/**
 * Executes the handler of a given command (if mounted).
 *
 * @param {string} command
 * The name of the handler that should be executed.
 *
 * @param {Request} req (see `Request`)
 * @param {Response} req (see `Response`)
 *
 */
Router.prototype.exec = function exec (command, req, res) {
    var route = this.$routes[command];

    debug('Asked for executing route %s', command);

    if (route) {
        debug('About to execute route "%s".', command);

        return route(req, res);
    } else {
        debug('Route not found: %s', command);
    }
};
