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
 * Creates a response object which will be used within the user's command handler.
 * 
 * @param {Request} request
 * The request DTO (see `Request`).
 * 
 * @param {Socket} socket
 * The socket that will be used within the response `send` function.
 * 
 * @returns {object}
 * Response object that provides an API with which the user can answer a request.
 * 
 */
module.exports = function initialize (request, socket) {

    return {
        send : function (body) {
            var dto = {};
            var buffer = null;
            
            dto.id = request.id;
            dto.command = request.command;
            dto.body = body;
            
            buffer = new Buffer(protocol.serialize('response', dto));

            socket.send(buffer, request.connection.remotePort, request.connection.remoteAddress);
        }
    };
};