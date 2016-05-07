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
		},
		comment : { type: String },
		dateCreate  : { type: Date, default: Date.now }
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
	
	schema.statics.createWaypoint = function(raceId, placeObj, commentObj, callback) {
		var Waypoint = this.model("Waypoint");
		var newWaypoint = new Waypoint({ raceID: raceId,  place: placeObj, comment: commentObj});
		newWaypoint.save(callback(newWaypoint));
		
		/*({ raceID: raceId,  place: placeObj}, function(err) {
			if(err) {
				console.log(err);
				callback(err);
			}
			callback(err);
		});*/
	}
	
	schema.statics.deleteWaypoint = function(waypointId, callback) {
		this.model("Waypoint").find({ _id: waypointId }).remove(callback);
	}
	
	mongoose.model('Waypoint', schema);
}