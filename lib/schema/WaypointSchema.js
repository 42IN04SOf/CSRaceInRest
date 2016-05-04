module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		raceID : { type: String, ref: 'Race' },
		place : { 
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
		}
	})
	
	// retrieve waypoints with current raceId
	schema.methods.populateWaypoints = function() {
		// todo
	}
	// retrieve participant with current raceId
	schema.methods.populateParticipants = function() {
		// todo
	}
	
	schema.methods.isRaceOwner = function(user) {
		return this.raceID.ownerID == user._id;
	}
	
	mongoose.model('Waypoint', schema);
}