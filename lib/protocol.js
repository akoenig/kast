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
 * @private
 *
 * Parses an incoming raw request string:
 *
 *     <type>;<id>;<command>;<body>
 *
 * Example:
 *
 *     request;123123234234;/users;uptime=10h
 *
 * @param {string} raw
 * The raw response string.
 *
 * @returns {object} The parsed request DTO:
 *
 *     {
 *         id: {number},
 *         command: {string},
 *         body: {string}
 *     }
 *
 */
Protocol.prototype.$parseRequest = function $parseRequest (raw) {
    var parts = raw.split(this.$DELIMITER);
    var request = {};

    if (!parts.length || parts[0] !== 'request') {
        return request;
    }

    request.id = parts[1];
    request.command = parts[2];
    request.body = parts[3];

    debug('Parsed request to DTO %j', request);

    return request;
};

/**
 * @private
 *
 * Serializes a response DTO to a string representation.
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
 * @returns {string}
 *
 */
Protocol.prototype.$serializeResponse = function $serializeResponse (dto) {
    var response = ['response', dto.id, dto.command, dto.body];
    var result = response.join(this.$DELIMITER);

    debug('Serialized response from DTO to: %s', result);

    return result;
};

/**
 * Method for parsing the string representation of `requests`/`responses`.
 *
 * @param {string} type
 * The parser type, e.g. `request`.
 *
 * @param {Buffer} raw
 * The raw `request`/`response` message.
 *
 * @returns {object}
 *
 */
Protocol.prototype.parse = function parse (type, raw) {
    var result = {};

    raw = raw.toString('utf-8');

    switch (type) {
        case 'request':
            result = this.$parseRequest(raw);
        break;
    }

    return result;
};

/**
 * Method for serializing a `request`/`response` DTO to a string representation.
 *
 * @param {string} type
 * The serializer type, e.g. `response`.
 *
 * @returns {string}
 *
 */
Protocol.prototype.serialize = function serialize (type, dto) {
    var result = '';

    switch (type) {
        case 'response':
            result = this.$serializeResponse(dto);
        break;
    }

    return result;
};
