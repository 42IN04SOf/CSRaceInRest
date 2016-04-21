var mongoose = require('mongoose');
var configDB = require('./config/database.js');

var preDbHelper = require('./lib/module/dbHelper');
var dbHelper = new preDbHelper(mongoose, config.db);

mongoose.connect(configDB.url); // connect to our database