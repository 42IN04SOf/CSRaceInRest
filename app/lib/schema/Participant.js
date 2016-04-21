module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		raceID: { type: String, ref: 'race' },
		userID: { type: String, ref: 'user' },
		waypointsCompleted: [{ waypoint: { waypointID: { type: String }, dateCreate: { type: Date, default: Date.now } } }],
		dateCreate: { type: Date, default: Date.now }
	});
	
	mongoose.model('Participant', schema);
}