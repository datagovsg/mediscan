'use strict';

require('serve-favicon');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const argv = require('minimist')(process.argv.slice(2));
const bodyParser = require('body-parser');
const cors = require('cors');

const prescriptions = require('./routes/prescriptions');
const prescriptionsApi = require('./routes/api/prescriptions');
const messagesApi = require('./routes/api/messages');
const scheduler = require('./scheduler');

const app = express();
const subpath = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');

app.use('/documentation',
  express.static(path.join(__dirname, 'public', 'dist')));

let swagger = require('swagger-node-express').createNew(subpath);

swagger.setApiInfo({
  title: 'Mediscan API',
  description: 'Mediscan API description',
  termsOfServiceUrl: '',
  contact: 'ratsjosh@outlook.com',
  license: '',
  licenseUrl: '',
});

app.get('/documentation', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

app.get('/swagger.json', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'api-docs.json'));
});

swagger.setAppHandler(subpath);

// Configure the API domain
let domain = 'localhost';
if(argv.domain !== undefined) {
  domain = argv.domain;
}	else {
  console.log('No --domain=xxx specified, taking default hostname "localhost".');
}

// Configure the API port
let port = 3000;
if(argv.port !== undefined) {
  port = argv.port;
} else {
  console.log('No --port=xxx specified, taking default port ' + port + '.');
}

// Set and display the application URL
let applicationUrl = 'http://' + domain + ':' + port + '/documentation';
console.log('snapJob API running on ' + applicationUrl);


swagger.configure(applicationUrl, '1.0.0');

// ROUTE

// Prescriptions
app.use('/', prescriptions);
app.use('/prescriptions', prescriptions);

// API
app.use(cors());
app.use('/api/prescriptions', prescriptionsApi);
app.use('/api/messages', messagesApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

scheduler.start();

module.exports = app;
