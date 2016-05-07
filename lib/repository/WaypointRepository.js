module.exports = function(mongoose, modelName) {
	var WaypointRepository = require('../baseRepository')(mongoose, modelName);
	
	var WaypointSchema = mongoose.model(modelName);
	
	WaypointRepository.removeWhere = function(ids) {
		return function(req, res, next) {
			WaypointSchema.remove(ids(req, res), function(err, count) {
				if(err) { return next(err); }
				req[modelName] = count;
				return next();
			})
		}
	};
	
    return WaypointRepository; 
}