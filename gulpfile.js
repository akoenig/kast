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
var sequence = require('run-sequence');

var paths = {};

paths.sources = [
    path.join(__dirname, 'index.js'),
    path.join(__dirname, 'lib', '**', '*.js')
];

gulp.task('lint', function () {
    return gulp.src(paths.sources)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', function (callback) {
    return sequence('lint', callback);
});