module.exports = function(mongoose, modelName) {
	var RaceRepository = require('../baseRepository')(mongoose, modelName);
	
	var Model = mongoose.model('Race');
	
	// optional: Add more repository-methods
	RaceRepository.read = function(where) {
		where = where || function(req, res){ return {}; };
		return function(req, res, next) {
			Model.find(where(req, res), function(err, result){
				if(err) { return next(err) }
				if(!result) { return next(null, false); }
				var opts = [{ path: 'ownerID', select: 'google.name', model: 'User' }]
				Model.populate(result, opts, function(err, popResult) {
					if(err) { return next(err) }
					req[modelName] = popResult;
					next();
				});
			});
		}
	}
	
	return RaceRepository; 
}