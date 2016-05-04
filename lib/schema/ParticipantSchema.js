module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		raceID: { type: String, ref: 'Race' },
		userID: { type: String, ref: 'User' },
		waypointsCompleted: [{ waypoint: { waypointID: { type: String }, dateCreate: { type: Date, default: Date.now } } }],
		dateCreate: { type: Date, default: Date.now }
	});
	
	
	schema.methods.addCompletedWaypoint = function(asdasd) {
		
	}
	
	// ===================================================
	// AUTHORIZATION =====================================
	// ===================================================
	// Returns true is the given user is the participant.
	schema.methods.isParticipant = function(user) { 
		return this.userID === user._id;
	}

	// Returns true is the given user is authorized.
	schema.methods.authorize = function(user) {
		return user.isAdmin() 
			|| this.isParticipant(user);
	}
	
	mongoose.model('Participant', schema);
}