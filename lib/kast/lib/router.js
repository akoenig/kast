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

Router.prototype.mount = function mount (command, handler) {
    this.$routes[command] = handler;
};

Router.prototype.exec = function exec (command, req, res) {
    var route = this.$routes[command];
    
    if (route) {
        debug('About to execute route "%s".', command);

        return route(req, res);
    } else {
        debug('Route not found: %s', command);
    }
};