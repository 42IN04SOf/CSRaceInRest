module.exports = function(mongoose, modelName) {
	var RaceRepository = require('../BaseRepository')(mongoose, modelName);
	
	var Model = mongoose.model('Race');
	
	// optional: Add more repository-methods
	RaceRepository.read = function(where) {
		where = where || function(req, res){ return {}; };
		return function(req, res, next) {
			var predicate = where(req, res);            
            var promise = Model.find(predicate)
                .sort('-dateCreate');
			if(	req.query.skip
				&& req.query.take
				&& !isNaN(Number(req.query.skip))
				&& !isNaN(Number(req.query.take))
				&& Number(req.query.skip) >= 0
				&& Number(req.query.take) >= 0) {
                promise.skip(Number(req.query.skip))
                    .limit(Number(req.query.take))
            }
			
			promise.exec(function(err, result){
                if(err) { return next(err) }
				// if(!result) { return next(null, false); }
				var opts = [{ path: 'ownerID', select: '_id local.email google.name', model: 'User' }]
				Model.populate(result, opts, function(pErr, popResult) {
					if(pErr) { return next(pErr) }
					var innerPromise = Model.find(predicate);
					innerPromise.count(function(cErr, totalCount) {
						if(cErr) { return next(cErr) }
						req[modelName] =  {
							totalCount: totalCount,
							count: popResult.length,
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
				var opts = [{ path: 'ownerID', select: '_id local.email google.name', model: 'User' }]
				Model.populate(result, opts, function(pErr, popResult) {
					req[modelName] = popResult;
					next();
				});
            });
        }
    }
	
	return RaceRepository; 
}