// ==== APP DEPENDENCIES ====
// 3rd-party
var express       	= require('express');
var path          	= require('path');
var favicon       	= require('serve-favicon');
var morgan        	= require('morgan');
var cookieParser	= require('cookie-parser');
var bodyParser    	= require('body-parser');
var session       	= require('express-session');
var mongoose		= require('mongoose');

// config
var databaseConfig	= require('./config/database');

// lib
var databaseHelper 	= require('./lib/module/databaseHelper');
var returnHelper 	= require('./lib/module/returnHelper');

// router
var indexRouter		= require('./routes/index');

// ==== APP INITIALIZATION ====
var app = express();

// default setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// database setup
databaseHelper(mongoose, databaseConfig);

// auth setup

// return setup
app.use(returnHelper);

// ==== ROUTING ====
// todo: add all routers here
app.use('/', indexRouter);

// no router applicable, catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// ==== GLOBAL ERROR HANDLERS ====
// todo: put in external module.

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