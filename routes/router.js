'use strict';

const path = require('path');
const express = require('express');

const brokerApis = require('./brokerApis');
const mgmtApis = require('./mgmtApis');
const cfApis = require('./cfApis');

const router = express.Router();

router.use('/v2', brokerApis);
router.use('/mgmt', mgmtApis);
router.use('/cf', cfApis);

// Serve static assets
router.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

// Always return the main index.html, so react-router render the route in the client
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

module.exports = router;
