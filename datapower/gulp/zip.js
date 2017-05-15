'use strict';

const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('zip', [
  'zip:cf-integration'
]);

gulp.task('zip:cf-integration', ['export-xml'], () => {
  return gulp.src('build/cf-integration/**')
    .pipe(zip('cf-integration.zip'))
    .pipe(gulp.dest('build'));
});
