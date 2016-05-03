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
var passport 		= require('passport');
var flash    		= require('connect-flash');

// config
var databaseConfig	= require('./config/database');
var languageConfig	= require('./config/language');

var passportConfig	= require('./config/passport');
var authConfig		= require('./config/auth');

// lib
var databaseHelper 	= require('./lib/module/databaseHelper');
var returnHelper 	= require('./lib/module/returnHelper');
var translator 		= require('./lib/module/translator');
var colorizer		= require('./lib/module/colorizer');

// router
var indexRouter		= require('./routes/index');
var authRouter		= require('./routes/AuthRouter');

var raceRouter		= require('./routes/RaceRouter');
var userRouter		= require('./routes/UserRouter');

// ==== APP INITIALIZATION ====
var app = express();

// module setup
databaseHelper 	= databaseHelper(mongoose, databaseConfig);
translator 		= translator('./../../lang', languageConfig);

passportConfig(passport, mongoose.model('User'), authConfig, translator);
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
app.use(session({ secret: 'B U L L E T B U L L E T B U L L E T' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// router init
authRouter = authRouter(passport);

raceRouter = raceRouter(databaseHelper.repositories.Race);
userRouter = userRouter(databaseHelper.repositories.User); 

// ==== ROUTING ====
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/race', raceRouter);
app.use('/user', userRouter);

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
		console.error(colorizer.modify(['bright', 'white', 'bgred'], err.stack));
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