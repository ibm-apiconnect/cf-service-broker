'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');

gulp.task('copy', [
  'copy:cf-integration'
]);

gulp.task('copy:cf-integration', () => {
  return gulp.src([
      'src/cf-integration/**',
      '!src/cf-integration/export.xml'
    ])
    .pipe(gulp.dest('build/cf-integration'));
});
