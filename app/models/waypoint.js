// load the things we need
var mongoose = require('mongoose');

// define the schema for our race model
var placeSchema = mongoose.Schema({
    geometry: { location: { lat: { type: Number }, lng: { type: Number } } },
    icon: { type: String },
    id: { type: String },
    name: { type: String },
    place_id: { type: String },
    rating: { type: Number },
    reference: { type: String },
    scope: { type: String },
    types: [{ type: String }],
    vicinity: { type: String }
});

var waypointSchema = mongoose.Schema({
    raceid : { type: String },
    place : { geometry: { location: { lat: { type: Number }, lng: { type: Number } } },
    icon: { type: String },
    id: { type: String },
    name: { type: String },
    place_id: { type: String },
    rating: { type: Number },
    reference: { type: String },
    scope: { type: String },
    types: [{ type: String }],
    vicinity: { type: String }}
})

// create the model for users and expose it to our app
module.exports = mongoose.model('Waypoint', waypointSchema);