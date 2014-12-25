/*
 * meeting
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
    var marshaller = new Marshaller();
    
    return {
        deserialize: marshaller.deserialize.bind(marshaller)
    };
};

function Marshaller () {
    
}

Marshaller.prototype.deserialize = function deserialize (body) {
    var parts = body.split(';');
    
    return {
        name: parts[0],
        payload: parts[1]
    };
};