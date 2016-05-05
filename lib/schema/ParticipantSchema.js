module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		raceID: { type: String, ref: 'Race' },
		userID: { type: String, ref: 'User' },
		waypointsCompleted: [{ waypointID: { type: String, ref: "Waypoint" }, dateCreate: { type: Date, default: Date.now } }],
		dateCreate: { type: Date, default: Date.now }
	});
	
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

	
	schema.statics.getParticipantsByRaceId = function(raceId, callback) {
		this.model('Participant').find({ raceID: raceId }, callback);
	}
	
	schema.statics.getParticipantsByUserId = function(userId, callback) {
		this.model('Participant').find({ userID: userId }).populate('raceID').exec(function(err, item) {
			if(err) {
				console.log(err);
			} else {
				callback(err, item);
			}
		});
	}
	
	schema.methods.addCompletedWaypoint = function(waypointId, callback) {
		console.log(waypointId);
		this.waypointsCompleted.push({ waypointID: waypointId });
		this.save(callback);
	}
	
	mongoose.model('Participant', schema);
}