module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		name        : { type: String },
		ownerID     : { type: String, ref: 'user' },
		dateCreate  : { type: Date, default: Date.now },
		dateStart   : { type: Date},
		dateStop    : { type: Date}
	});
	
	// add static method
	schema.statics.test = function() {
		console.log('Een static test');
	}
	
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
	
	schema.methods.resetStartStop = function() {
		var self = this;
		delete self.dateStart;
		delete self.dateStop;
		this.save();
	}
	
	schema.methods.getParticipants = function() {
		this.populate()
	}
	
	schema.statics.getRacesAsOwner = function (userId, callback) {
		this.model('Race').find({ ownerID: userId }).exec(function (err, item) {
			if (err) {
				console.log(err);
			} else {
				callback(err, item);
			}
		});
	}
	
	// removes unnecessary properties and returns a plain JS-object
	schema.methods.asPublic = function() {
		var race = this.toObject();
		delete race["__v"];
		return race;
	}
	
	mongoose.model('Race', schema);
}