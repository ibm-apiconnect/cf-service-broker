'use strict';

const express = require('express');

const mgmtApis = require('../lib/mgmtApis');

const router = express.Router();

router.get('/config', (req, res) => {
  res.send(mgmtApis.getConfig());
});

router.get('/orgs', (req, res) => {
  let managementServer = req.headers.managementserver;
  let managementAuth = req.headers.authorization;
  mgmtApis.getOrgs(managementServer, managementAuth)
    .then(orgs => res.send(orgs))
    .catch(err => {
      res.status(err.statusCode).send(err.error || err);
    });
});

router.get('/orgs/:orgId/catalogs', (req, res) => {
  let managementServer = req.headers.managementserver;
  let managementAuth = req.headers.authorization;
  mgmtApis.getCatalogs(req.params.orgId, managementServer, managementAuth)
    .then(catalogs => res.send(catalogs))
    .catch(err => {
      res.status(err.statusCode).send(err.error || err);
    });
});

router.get('/orgs/:orgId/catalogs/:catalogId/apis', (req, res) => {
  let managementServer = req.headers.managementserver;
  let managementAuth = req.headers.authorization;
  mgmtApis.getApis(req.params.orgId, req.params.catalogId, managementServer, managementAuth)
    .then(apis => res.send(apis))
    .catch(err => {
      res.status(err.statusCode).send(err.error || err);
    });
});

module.exports = router;
