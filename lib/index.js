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

var mandatory = require('mandatory');
var VError = require('verror');

var Meeting = require('./meeting');

module.exports.attend = function attend (name, callback) {
    var meeting = null;

    function onAttend (err) {
        var session = null;

        if (err) {
            return callback(new VError(err, 'Unable to attend the meeting.'));
        }

        // Front-facing API
        session = {
            lookup: meeting.lookup.bind(meeting),
            bye: meeting.bye.bind(meeting)
        };

        callback(null, session);
    }

    mandatory(name).is('string', 'Please define a meeting name to attend.');
    mandatory(callback).is('function', 'Please define a callback function.');

    meeting = new Meeting();

    meeting.attend(name, onAttend);
};