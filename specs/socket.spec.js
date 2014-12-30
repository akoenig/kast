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

var expect = require('expect.js');

var kast = require('../');

describe('The socket implementation', function suite () {

    this.timeout(4000);

    it('should be able to start listening on a defined port without errors', function test (done) {
        var app = kast();

        var socket = app.listen(5000, function onListen (err) {
            expect(err).to.be(null);

            expect(socket).not.to.be(undefined);

            socket.close(function onClose () {
                done();
            });
        });
    });

});
