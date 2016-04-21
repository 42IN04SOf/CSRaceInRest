module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		name        : { type: String },
		ownerID     : { type: String, ref: 'user' },
		dateCreate  : { type: Date, default: Date.now },
		dateStart   : { type: Date},
		dateStop    : { type: Date}
	});
	
	// retrieve waypoints with current raceId
	schema.methods.populateWaypoints = function() {
		// todo
	}
	// retrieve participant with current raceId
	schema.methods.populateParticipants = function() {
		// todo
	}
	
	mongoose.model('Race', schema);
}