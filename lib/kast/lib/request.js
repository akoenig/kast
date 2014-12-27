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

/**
 * Creates a request DTO out of the raw request buffer and
 * the client's connection details.
 * 
 * The created object will be used within the user's command handler.
 * 
 * @param {Buffer} raw
 * The raw request buffer
 * 
 * @param {object} rinfo
 * The client's connection details
 * 
 * @returns {object} The request DTO.
 *
 */
module.exports = function initialize (raw, rinfo) {
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