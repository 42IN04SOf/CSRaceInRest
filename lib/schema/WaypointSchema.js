module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		raceID : { type: String, ref: 'race' },
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
	
	schema.statics.createWaypoint = function(raceId, placeObj, callback) {
		var Waypoint = this.model("Waypoint");
		var newWaypoint = new Waypoint({ raceID: raceId,  place: placeObj});
		newWaypoint.save(callback(newWaypoint));
		
		/*({ raceID: raceId,  place: placeObj}, function(err) {
			if(err) {
				console.log(err);
				callback(err);
			}
			callback(err);
		});*/
	}
	
	mongoose.model('Waypoint', schema);
}