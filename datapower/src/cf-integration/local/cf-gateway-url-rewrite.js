var url = require('url');
var hm = require('header-metadata');
var sm = require('service-metadata');

var inUrl = url.parse(sm.getVar('var://service/routing-url'));
var cfUrl = url.parse(hm.current.get("X-Cf-Forwarded-Url"));

var inUrlPathBits = inUrl.pathname.split('/');
// this wont work if API Connect is setup with dynamic dns
if (inUrlPathBits.length === 4) {
  if (cfUrl.pathname.startsWith('/' + inUrlPathBits[3] + '/')) {
    inUrlPathBits.pop();
    inUrl.pathname = inUrlPathBits.join('/');
  }
}

var result =
    inUrl.protocol + '//' +
    inUrl.hostname + ':443' +
    inUrl.pathname +
    (cfUrl.pathname || '') +
    (cfUrl.search || '') +
    (cfUrl.hash || '');

sm.setVar('var://service/routing-url', result);
