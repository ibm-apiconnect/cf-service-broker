'use strict';

const path = require('path');
const fs = require('mz/fs');

const conf = require('../utils/conf');
const logger = require('../utils/logging').getLogger('cfApis');

const brokerConfig = conf.get('broker');
const managerConfig = conf.get('apimanager');
const catalogDir = path.normalize(path.join(__dirname, '../configs/catalog-files'));

function getCatalog() {
  logger.trace('cfApis.getCatalog request');
  return fs.readFile(path.join(catalogDir, 'catalog.json'), 'utf-8')
    .then(JSON.parse);
}

function provision(id, provisionRequest) {
  logger.trace(`cfApis.provision request. id: ${id}; request:${provisionRequest}`);
  return {
    dashboard_url: brokerConfig.dashboardUrl,
  };
}

function deprovision(id) {
  logger.trace(`cfApis.deprovision request. id: ${id}`);
  return {};
}

/**
 * Need to account for three separate things:
 * (1) accept 'targetUrl' -- echo this back as route_service_url
 * (2) accept 'providerOrg', 'catalogId', 'basePath', 'gatewayUrl' -- craft the url and send back as route_service_url
 * (3) accept 'providerOrg', 'catalogId', 'basePath' -- pull 'gatewayUrl' from config and craft the url; send back as route_service_url
 */
function bind(id, appId, parameters) {
  logger.trace(`cfApis.bind request. id: ${id}; appId: ${appId}; parameters: ${JSON.stringify(parameters)}`);
  return {
    route_service_url: parameters.targetUrl || buildRouteServiceUrl(parameters.providerOrg, parameters.catalogId, parameters.basePath, parameters.gatewayUrl),
  };
}

function unbind(id, appId) {
  logger.trace(`cfApis.unbind request. id: ${id}; appId: ${appId}`);
  return {};
}

function buildRouteServiceUrl(providerOrg, catalogId, basePath, gatewayUrl) {
  if (!providerOrg || ! catalogId) {
    let err = new Error('\'providerOrg\' and \'catalogId\' are required fields');
    err.statusCode = 400;
    throw err;
  }
  if (!gatewayUrl) {
    if (!managerConfig || !managerConfig.gatewayUrl) {
      let err = new Error('\'gatewayUrl\' is a required field');
      err.statusCode = 400;
      throw err;
    }
    gatewayUrl = managerConfig.gatewayUrl;
  }
  return `${gatewayUrl}/${providerOrg}/${catalogId}/${basePath}`;
}

module.exports = {
  getCatalog,
  provision,
  deprovision,
  bind,
  unbind,
};
