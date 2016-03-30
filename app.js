// package dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var querystring = require('querystring');

// miscellanous
var config = require('./config');
var returnHandler = require('./lib/module/returnHandler');

var preDbHelper = require('./lib/module/dbHelper');
var dbHelper = new preDbHelper(mongoose, config.db);

// subrouters
var index = require('./routes/index')();
var user = require('./routes/user')(dbHelper.repositories.user);
var entity = require('./routes/entity')(dbHelper.repositories.entity);
var waypoint = require('./routes/waypoint')(dbHelper.repositories.waypoint);
var race = require('./routes/race')(dbHelper.repositories.race);
var participant = require('./routes/participant')(dbHelper.repositories.participant);
var stats = require('./routes/stats')(dbHelper.repositories.stats);

// start
var app = express();
// dfta
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add lib handler
app.use(returnHandler);

// define routes here
app.use('/', index);
app.use('/user', user);
app.use('/entity', entity);
app.use('/waypoint', waypoint);
app.use('/race', race);
app.use('/participant', participant);
app.use('/stats', stats);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
