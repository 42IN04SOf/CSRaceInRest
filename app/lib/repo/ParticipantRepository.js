module.exports = function(mongoose, model) {
	var Participant = mongoose.model(model);
	
	// ... -> user participates in race
	this.create = function() {
		
	}
	
	// ... -> participant completes waypoint (if race is started)
	this.update = function() {
		
	}
}