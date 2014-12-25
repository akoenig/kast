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

var meeting = require('./lib/');

module.exports = function initialize () {
    return {
        attend : meeting.attend.bind(meeting)
    };
};