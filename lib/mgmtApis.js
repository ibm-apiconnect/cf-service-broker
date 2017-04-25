'use strict';

const rp = require('request-promise');

const conf = require('../utils/conf');
const logger = require('../utils/logging').getLogger('mgmtApis');

const managerConfig = conf.get('apimanager');

function getConfig() {
  logger.trace('mgmtApis.getConfig request');
  return managerConfig || {};
}

function getOrgs(server, auth) {
  logger.trace(`mgmtApis.getOrgs request; server: ${server}; auth: ${auth}`);
  return rp.get({
    uri: `${server}/v1/me/orgs`,
    headers: {
      authorization: auth,
    },
    rejectUnauthorized: false,
  });
}

function getCatalogs(orgId, server, auth) {
  logger.trace(`mgmtApis.getCatalogs request. orgId: ${orgId}; server: ${server}; auth: ${auth}`);
  return rp.get({
    uri: `${server}/v1/orgs/${orgId}/environments`,
    headers: {
      authorization: auth,
    },
    rejectUnauthorized: false,
  });
}

function getApis(orgId, catalogId, server, auth) {
  logger.trace(`mgmtApis.getAPIs request. orgId: ${orgId}; catalogId: ${catalogId}; server: ${server}; auth: ${auth}`);
  return rp.get({
    uri: `${server}/v1/orgs/${orgId}/environments/${catalogId}/apis`,
    headers: {
      authorization: auth,
    },
    rejectUnauthorized: false,
  });
}

module.exports = {
  getConfig,
  getOrgs,
  getCatalogs,
  getApis,
};
