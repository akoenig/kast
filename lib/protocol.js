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

var debug = require('debug')('kast:Protocol');

module.exports = function initialize () {
    var protocol = new Protocol();

    //
    // Preparing the front-facing API.
    //
    return {
        parse: protocol.parse.bind(protocol),
        serialize: protocol.serialize.bind(protocol)
    };
};

function Protocol () {
    this.$DELIMITER = ';';
}

/**
 * Method for parsing the string representation of `requests`/`responses`.
 *
 *     <type>;<id>;<command>;<body>
 *
 * Example:
 *
 *     request;123123234234;/users;uptime=10h
 *
 * @param {string} type
 * The parser type, e.g. `request`.
 *
 * @param {Buffer} raw
 * The raw `request`/`response` message.
 *
 * @returns {object} An example:
 *
 *     {
 *         id: 123123234234,
 *         command: '/users',
 *         body: uptime=10h
 *     }
 *
 */
Protocol.prototype.parse = function parse (type, raw) {
    var result = {};
    var parts;

    if (!/(request|response)/.test(type)) {
        return result;
    }

    raw = raw.toString('utf-8');

    parts = raw.split(this.$DELIMITER);

    result.id = parts[1];
    result.command = parts[2];
    result.body = parts[3];

    return result;
};

/**
 * Method for serializing a `request`/`response` DTO to a string representation.
 *
 * Example:
 *
 *     {
 *         id: 123123234234,
 *         command: '/users',
 *         body: '192.168.0.1'
 *     }
 *
 * => response;123123234234;/users;192.168.0.1
 *
 * @param {string} type
 * The serializer type, e.g. `response`.
 *
 * @returns {string}
 *
 */
Protocol.prototype.serialize = function serialize (type, dto) {
    var result = '';
    var parts = [type, dto.id, dto.command, dto.body];

    if (!/(request|response)/.test(type)) {
        return result;
    }

    result = parts.join(this.$DELIMITER);

    debug('Serialized request from DTO to: %s', result);

    return result;
};
