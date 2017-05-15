'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const Stream = require('readable-stream');
const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

let createHash = (file) => {
  let str = fs.readFileSync(file);
  return crypto
    .createHash('sha1')
    .update(str, 'utf8')
    .digest('base64');
};

let createFilesXML = () => {
  let stream = new Stream.Transform({objectMode: true});
  stream._transform = (file, unused, cb) => {
    if (!file.isBuffer()) {
      throw new Error('createFilesXML expects a Buffer');
    }
    Promise.all([
      glob('build/cf-integration/local/**'),
      glob('build/cf-integration/dp-aux/**')
    ]).then((result) => {
      let xml = [];
      for (let files of result) {
        if (!files || files.length === 0) continue;
        let plen = files[0].length;
        let location = path.basename(files[0]);
        let scheme = location === 'dp-aux' ? 'webgui://' : 'local://';
        let internal = location === 'dp-aux' ? ' internal="true" ' : ' ';
        for (let idx = 1; idx < files.length; idx++) {
          let abs = path.resolve(__dirname, '..', files[idx]);
          if (fs.statSync(abs).isFile()) {
            let name = scheme + files[idx].slice(plen);
            let src = location + files[idx].slice(plen);
            let hash = createHash(abs);
            xml.push(`<file name="${name}" src="${src}" location="${location}"${internal}hash="${hash}" />`);
          }
        }
      }
      let search = '<files>\n';
      file.contents = new Buffer(
        String(file.contents).replace(search, search + xml.join('\n') + '\n'));
      return cb(null, file);
    });
  };
  return stream;
};

gulp.task('export-xml', ['copy'], () => {
  return gulp.src('src/cf-integration/export.xml')
    .pipe(createFilesXML())
    .pipe(rename('export.xml'))
    .pipe(gulp.dest('build/cf-integration'));
});
