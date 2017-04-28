'use strict';

const rp = require('request-promise');
const Promise = require('bluebird');

const conf = require('../utils/conf');
const logger = require('../utils/logging').getLogger('cfApis');

const cfConfig = conf.get('cf');

var DOMAIN_LIST = {};

function getConfig() {
  logger.trace('cfApis.getConfig request');
  return cfConfig || {};
}

function getApps(server, auth) {
  logger.trace(`cfApis.getApps request. server: ${server}; auth: ${auth}`);
  return rp.get({
    uri: `${server}/v2/apps`,
    headers: {
      authorization: auth,
    },
    json: true,
    rejectUnauthorized: false,
  })
    .then(response => response.resources)
    .then(apps => apps.map(app => ({
      id: app.metadata.guid,
      name: app.entity.name,
    })));
}

function getRoutes(appId, server, auth) {
  logger.trace(`cfApis.getRoutes request. appId: ${appId}; server: ${server}; auth: ${auth}`);
  return rp.get({
    uri: `${server}/v2/apps/${appId}/routes`,
    headers: {
      authorization: auth,
    },
    json: true,
    rejectUnauthorized: false,
  })
    .then(response => response.resources)
    .then(routes => {
      return Promise.mapSeries(routes, route => {
        return getDomain(route.entity.domain_guid, server, auth)
          .then(domain => {
            return {
              id: route.metadata.guid,
              name: `${route.entity.host}.${domain}`,
            };
          });
      });
    });
}

function bindToRoute(routeId, targetUrl, server, auth) {
  logger.trace(`cfApis.bindToRoute request. routeId: ${routeId}; targetUrl: ${targetUrl}; server: ${server}; auth: ${auth}`);
  return getServiceInstance(server, auth)
    .then(instanceId => {
      if (!instanceId) {
        let err = new Error('An instance of \'api-connect-route-services\' is required to bind.');
        err.statusCode = 400;
        throw err;
      }
      return rp.put({
        uri: `${server}/v2/service_instances/${instanceId}/routes/${routeId}`,
        headers: {
          authorization: auth,
        },
        json: {
          parameters: {
              targetUrl: targetUrl,
          },
        },
        rejectUnauthorized: false,
      });
    });
}

function getDomain(domainId, server, auth) {
  if (!DOMAIN_LIST[domainId]) {
    return rp.get({
      uri: `${server}/v2/domains/${domainId}`,
      headers: {
        authorization: auth,
      },
      json: true,
      rejectUnauthorized: false,
    })
      .then(domain => {
        DOMAIN_LIST[domainId] = domain.entity.name;
        return domain.entity.name;
      });
  }
  return Promise.resolve(DOMAIN_LIST[domainId]);
}

function getServiceInstance(server, auth) {
  return rp.get({
    uri: `${server}/v2/service_instances`,
    qs: {
      q: 'name:api-connect-route-services',
    },
    headers: {
      authorization: auth,
    },
    json: true,
    rejectUnauthorized: false,
  })
    .then(response => response.resources)
    .then(instances => instances.length ? instances[0].metadata.guid : null);
}

module.exports = {
  getConfig,
  getApps,
  getRoutes,
  bindToRoute,
};
