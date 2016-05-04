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
var ejs 			= require('ejs');

// config
var databaseConfig	= require('./config/database');
var languageConfig	= require('./config/language');

// lib
var databaseHelper 	= require('./lib/module/databaseHelper');
var returnHelper 	= require('./lib/module/returnHelper');
var translator 		= require('./lib/module/translator');
var colorizer		= require('./lib/module/colorizer');

// router
var indexRouter		= require('./routes/index');
var raceRouter		= require('./routes/RaceRouter');
var userRouter		= require('./routes/UserRouter');
var participantRouter = require('./routes/ParticipantRouter');

// ==== APP INITIALIZATION ====
var app = express();

// module setup
databaseHelper 	= databaseHelper(mongoose, databaseConfig);
translator 		= translator('./../../lang', languageConfig);

ejs.filters.trans = translator.translate;

app.use(returnHelper);
app.use(translator.middleware);

// default setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router init
raceRouter = raceRouter(databaseHelper.repositories.Race, databaseHelper.repositories.Participant);
userRouter = userRouter(databaseHelper.repositories.User, databaseHelper.repositories.Participant, databaseHelper.repositories.Race);
participantRouter = participantRouter(databaseHelper.repositories.Participant)

// ==== ROUTING ====
// todo: add all routers here
app.use('/', indexRouter);
app.use('/race', raceRouter);
app.use('/user', userRouter);
app.use('/participant', participantRouter);

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
		console.error(colorizer.modify(['bright', 'white', 'bgred'], err.message));
		res.status(err.status || 500);
		res.render('error', {
			title: err.title,
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
		title: err.title,
		message: err.message,
		error: err
	});
});

module.exports = app;