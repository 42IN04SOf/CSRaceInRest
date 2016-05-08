// ==== TEST SETUP ====
var supertest = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var agent = supertest.agent('http://localhost:9090');

// ==== APP DEPENDENCIES ====
// 3rd-party
var express       		= require('express');
var path          		= require('path');
var morgan        		= require('morgan');
var cookieParser		= require('cookie-parser');
var bodyParser    		= require('body-parser');
var session       		= require('express-session');
var mongoose			= require('mongoose');
var ejs 				= require('ejs');
var passport 			= require('passport');
var flash    			= require('connect-flash');
var request				= require('request');

// config
var databaseConfig		= require('./config/database');
var languageConfig		= require('../config/language');

var passportConfig		= require('../config/passport');

var authorizationConfig	= require('../config/authorization');
var apikeysConfig		= require('../config/apikeys');

// lib
var databaseHelper 		= require('../lib/module/databaseHelper');
var returnHelper 		= require('../lib/module/returnHelper');

var tokenHandler 		= require('../lib/module/tokenHandler');
var authHandler 		= require('../lib/module/authHandler');

var translator 			= require('../lib/module/translator');
var colorizer			= require('../lib/module/colorizer');

// router
var raceRouter			= require('../routes/RaceRouter');
var userRouter			= require('../routes/Userrouter');
var authRouter			= require('../routes/AuthRouter');

// ==== APP INITIALIZATION ====
var app = express();
app.listen(9090);

// pre setup module setup
databaseHelper 	= databaseHelper(mongoose, databaseConfig);
translator 		= translator('../lang', languageConfig);

passportConfig(passport, mongoose.model('User'), apikeysConfig, translator);

authHandler		= authHandler(mongoose, authorizationConfig);
tokenHandler 	= tokenHandler(mongoose.model('User'));

ejs.filters.trans = translator.translate;

app.use(returnHelper);
app.use(translator.middleware);

// setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'B U L L E T B U L L E T B U L L E T' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// post setup module setup
app.use(tokenHandler.middleware);

// router init
raceRouter = raceRouter(
	databaseHelper.repositories.Race,
	databaseHelper.repositories.Participant,
	databaseHelper.repositories.Waypoint,
	authHandler,
	request);
userRouter = userRouter(
	databaseHelper.repositories.User,
	databaseHelper.repositories.Participant,
	databaseHelper.repositories.Race,
	authHandler);
authRouter = authRouter(
	passport, 
	authHandler);

// ==== ROUTING ====
app.use('/', authRouter);
app.use('/race', raceRouter);
app.use('/user', userRouter);


var raceTests = require('./routes/raceRouterTest');
raceTests.tests(app, agent, expect, should);

var userTests = require('./routes/userRouterTest');
userTests.tests(app, agent, expect, should);

var authTests = require('./routes/authRouterTest');
authTests.tests(app, agent, expect, should);