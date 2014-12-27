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

module.exports = function initialize () {
    var protocol = new Protocol();
    
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
 * Parses an incoming request
 * 
 * Request: type;id;command;payload
 * 
 */
Protocol.prototype.$parseRequest = function $parseRequest (raw) {
    var parts = raw.split(this.$DELIMITER);
    var request = {};

    if (!parts.length || 'request' !== parts[0]) {
        return request;
    }

    request.id = parts[1];
    request.command = parts[2];
    request.body = parts[3];
    
    return request;
};

Protocol.prototype.$serializeResponse = function $serializeResponse (dto) {
    var response = ['response', dto.id, dto.command, dto.body];

    return response.join(this.$DELIMITER);
};

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

Protocol.prototype.serialize = function serialize (type, dto) {
    var result = '';

    switch (type) {
        case 'response':
            result = this.$serializeResponse(dto);
        break;
    }
    
    return result;
};