module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		raceID: { type: String, ref: 'Race', required: true },
		userID: { type: String, ref: 'User', required: true },
		waypointsCompleted: [{ waypointID: { type: String, ref: "Waypoint", required: true }, dateCreate: { type: Date, default: Date.now, required: true } }],
		dateCreate: { type: Date, default: Date.now, required: true }
	});
	
	// ===================================================
	// AUTHORIZATION =====================================
	// ===================================================
	// Returns true is the given user is the participant.
	schema.methods.isParticipant = function(user) { 
		return user._id.equals(this.userID);
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
				callback(err);
			} else {
				callback(err, item);
			}
		});
	}
	
	schema.methods.addCompletedWaypoint = function(waypointId, callback) {
		if(this.waypointsCompleted.indexOf(waypointId) > -1) {
			this.waypointsCompleted.push({ waypointID: waypointId });
			return this.save(callback);
		}
		var err = new Error('race.alreadyParticipating');
		err.status = 400;
		throw err;
	}
	
	schema.methods.asPublic = function() {
		var participant = this.toObject();
		delete participant["__v"];
		return participant;
	}
	
	mongoose.model('Participant', schema);
}