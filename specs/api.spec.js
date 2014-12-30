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

describe('The front-facing API', function suite () {

    this.timeout(4000);

    it('should have a `listen` method with proper argument checks', function test (done) {
        var app = kast();

        expect(app.listen).not.to.be(undefined);
        expect(typeof app.listen).to.be('function');

        try {
            app.listen();
        } catch (e) {
            expect(e).not.to.be(undefined);
        }

        done();
    });

    it('should have a `command` method with proper argument checks', function test (done) {
        var app = kast();

        expect(app.command).not.to.be(undefined);
        expect(typeof app.command).to.be('function');

        try {
            app.command();
        } catch (e) {
            expect(e).not.to.be(undefined);
        }

        try {
            app.command('/foo');
        } catch (e) {
            expect(e).not.to.be(undefined);
        }

        done();
    });

    it('should have a `broadcast` method with proper argument checks', function test (done) {
        var success = true;

        expect(kast.broadcast).not.to.be(undefined);
        expect(typeof kast.broadcast).to.be('function');

        try {
            kast.broadcast();
        } catch (e) {
            expect(e).not.to.be(undefined);
        }

        //
        // Missing required params
        //
        try {
            kast.broadcast({});
        } catch (e) {
            expect(e).not.to.be(undefined);
        }

        try {
            kast.broadcast({
                port: 5000
            });
        } catch (e) {
            expect(e).not.to.be(undefined);
        }

        try {
            kast.broadcast({
                port: 5000,
                command: '/foo'
            }, function onResponse () {
                done();
            });
        } catch (e) {
            success = false;
        }

        expect(success).to.be(true);
    });
});
