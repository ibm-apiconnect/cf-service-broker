'use strict';

const express = require('express');

const cfApis = require('../lib/cfApis');
const logger = require('../utils/logging').getLogger('routes:cfApis');

const router = express.Router();

router.get('/config', (req, res) => {
  res.send(cfApis.getConfig());
});

router.get('/apps', (req, res) => {
  let server = req.headers.server;
  let auth = req.headers.authorization;
  cfApis.getApps(server, auth)
    .then(apps => res.send(apps))
    .catch(err => {
      logger.error(err);
      res.status(err.statusCode).send(err.error || err);
    });
});

router.get('/apps/:appId/routes', (req, res) => {
  let server = req.headers.server;
  let auth = req.headers.authorization;
  cfApis.getRoutes(req.params.appId, server, auth)
    .then(routes => res.send(routes))
    .catch(err => {
      logger.error(err);
      res.status(err.statusCode).send(err.error || err);
    });
});

router.post('/routes/:routeId/bind', (req, res) => {
  let server = req.headers.server;
  let auth = req.headers.authorization;
  cfApis.bindToRoute(req.params.routeId, req.body.targetUrl, server, auth)
    .then(response => res.send(response))
    .catch(err => {
      logger.error(err);
      res.status(err.statusCode).send(err.error || err.message || err);
    });
});

module.exports = router;
