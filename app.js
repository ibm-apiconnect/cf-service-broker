'use strict';

const express = require('express');
const path = require('path');
const http = require('http');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const logger = require('./utils/logging').getLogger('app');
const conf = require('./utils/conf');
const router = require('./routes/router');

const port = conf.get('PORT');

const app = express();


app.set('port', port);

app.use(favicon(path.join(__dirname, 'client', 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.statusCode || 500).send(err.message || 'Internal Server Error');
});

const server = http.createServer(app);

server.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    logger.error(`${bind} requires elevated privileges`);
    process.exit(1);
    break;
  case 'EADDRINUSE':
    logger.error(`${bind} is already in use`);
    process.exit(1);
    break;
  default:
    throw error;
  }
});

server.on('listening', () => {
  logger.info(`CF Service Broker started on port ${port}`);
});

server.listen(port);

module.exports = app;
