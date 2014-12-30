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

var path = require('path');

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var sequence = require('run-sequence');

var paths = {};

paths.sources = [
    path.join(__dirname, '*.js'),
    path.join(__dirname, 'lib', '**', '*.js'),
    path.join(__dirname, 'specs', '**', '*.spec.js')
];

paths.specs = [path.join(__dirname, 'specs', '**', '*.spec.js')];

gulp.task('specs', function specs () {
    return gulp.src(paths.specs, {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint', function lint () {
    return gulp.src(paths.sources)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('checkstyle', function checkstyle () {
    return gulp.src(paths.sources)
        .pipe(jscs());
});

gulp.task('default', function defaultTask (callback) {
    return sequence('lint', 'checkstyle', 'specs', callback);
});
