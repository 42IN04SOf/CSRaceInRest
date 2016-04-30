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
	
	schema.methods.start = function() {
		var self = this;
		if(self.dateStart)
			throw new Error('dota is kapot :(');
		
		console.log(Date.now());
		self.dateStart = Date.now();
		this.save();
	}
	schema.methods.stop = function() {
		var self = this;
		self.dateStop = Date.now();
		this.save();
	}
	
	// removes unnecessary properties and returns a plain JS-object
	schema.methods.asPublic = function() {
		var race = this.toObject();
		delete race["__v"];
		return race;
	}
	
	mongoose.model('Race', schema);
}