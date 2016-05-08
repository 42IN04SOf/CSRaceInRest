module.exports = function(mongoose, modelName) {
	var RaceRepository = require('../baseRepository')(mongoose, modelName);
	
	var Model = mongoose.model('Race');
	
	// optional: Add more repository-methods
	RaceRepository.read = function(where) {
		where = where || function(req, res){ return {}; };
		return function(req, res, next) {
			var predicate = where(req, res);            
            var promise = Model.find(predicate)
                .sort('-dateCreate');
			if(req.query.skip && req.query.take) {
                promise.skip(req.query.skip)
                    .limit(req.query.take)
            }
			
			promise.exec(function(err, result){
                if(err) { return next(err) }
				// if(!result) { return next(null, false); }
				var opts = [{ path: 'ownerID', select: 'google.name local.email', model: 'User' }]
				Model.populate(result, opts, function(pErr, popResult) {
					if(pErr) { return next(pErr) }
					Model.find(predicate).count(function(cErr, count) {
						if(cErr) { return next(cErr) }
						req[modelName] =  {
							count: count,
							result: popResult
						};
						next();
					});
				});
            });
		}
	}
	
	RaceRepository.readById = function(id) {
        return function(req, res, next) {
            Model.findOne({ "_id" : id(req, res) },{},function(err, result){
                if(err) {
                    if(err.name === 'CastError' && err.type === 'ObjectId') { // Here or @Errorhandler???
                        err.status = 404;
                        err.oldMessage = err.message;
                        err.message = 'global.notFound';
                    } 
                    return next(err)
                }
                if(!result) { return next(NotFoundError); }
				var opts = [{ path: 'ownerID', select: 'google.name local.email', model: 'User' }]
				Model.populate(result, opts, function(pErr, popResult) {
					req[modelName] = popResult;
					next();
				});
            });
        }
    }
	
	return RaceRepository; 
}