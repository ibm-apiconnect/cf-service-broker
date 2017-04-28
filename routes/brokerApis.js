'use strict';

const express = require('express');

const cfApis = require('../lib/brokerApis');

const router = express.Router();

/**
 * Catalog call
 */
router.get('/catalog', (req, res) => {
  return cfApis.getCatalog()
    .then(catalog => res.send(catalog));
});

router.put('/service_instances/:id', (req, res) => {
  let provisionRequest = req.body;
  res.send(cfApis.provision(req.params.id, provisionRequest));
});

router.delete('/service_instances/:id', (req, res) => {
  res.status(200).send(cfApis.deprovision(req.params.id));
});

router.put('/service_instances/:id/service_bindings/:appId', (req, res) => {
  let parameters = req.body.parameters;
  if (!parameters) {
    let err = new Error('Missing required parameters for route bind');
    err.statusCode = 400;
    throw err;
  }
  res.send(cfApis.bind(req.params.id, req.params.appId, parameters));
});

router.delete('/service_instances/:id/service_bindings/:appId', (req, res) => {
  res.status(200).send(cfApis.unbind(req.params.id, req.params.appId));
});

module.exports = router;
