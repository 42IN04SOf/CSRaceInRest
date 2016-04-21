module.exports = function(mongoose, model) {
	var Race = mongoose.Model(model);
	// create with name
	this.create = function() {
		
	}
	
	// retrieve single with raceId
	this.readById = function(req, res, next) {
		Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if(err) { return next(err) }
			req[model] = _race;
        })
	}
	
	// startRace, stopRace (if race has waypoints)
	this.update = function() {
		
	} 
}