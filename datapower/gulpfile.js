'use strict';

const gulp = require('gulp');
const requireDir = require('require-dir');

requireDir('./gulp');

gulp.task('build', [
  'clean',
  'copy',
  'export-xml',
  'zip'
]);

gulp.task('default', ['build']);

module.exports = gulp;
