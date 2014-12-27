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

var protocol = require('./protocol')();

module.exports = function instantiate (raw, rinfo) {
    var request = protocol.parse('request', raw);

    if (!request.id) {
        return null;
    }

    return {
        id: request.id,
        connection: {
            remoteAddress: rinfo.address,
            remotePort: rinfo.port
        },
        command: request.command,
        body: request.body
    };
};