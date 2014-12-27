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
        parse: protocol.parse.bind(protocol)
    };
};

function Protocol () {}

/**
 * @private
 * 
 * Parses an incoming request
 * 
 * Request: type;id;command;payload
 * 
 */
Protocol.prototype.$parseRequest = function $parseRequest (raw) {
    

    var parts = raw.split(';');
    var request = {};

    if (!parts.length || 'request' !== parts[0]) {
        return request;
    }

    request.id = parts[1];
    request.command = parts[2];
    request.body = parts[3];
    
    return request;
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