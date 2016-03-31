// load the things we need
var mongoose = require('mongoose');

// define the schema for our race model
var raceSchema = mongoose.Schema({

        name        : { type: String },
        ownerID     : { type: Schema.ObjectId, ref: 'user' },
        dateCreate  : { type: Date, default: Date.now },
        dateStart   : { type: Date},
        dateStop    : { type: Date}
        
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Race', raceSchema);