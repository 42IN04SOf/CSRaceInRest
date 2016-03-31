// load the things we need
var mongoose = require('mongoose');

// define the schema for our race model
var raceDeelnemerSchema = mongoose.Schema({

        raceID     : { type: String, ref: 'race' },
        userID     : { type: String, ref: 'user' },
        dateCreate  : { type: Date, default: Date.now }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('RaceDeelnemer', raceDeelnemerSchema);