module.exports = function(mongoose, modelName) {
	var ParticipantRepository = require('../baseRepository')(mongoose, modelName);
	
	var Participant = mongoose.model('Participant');
	
	// optional: Add more repository-methods
	ParticipantRepository.create = function(params) {
        return function(req, res, next) {
            var newModel = new Participant(params(req, res));
            newModel.save(function(err) {
                if(err) { return next(err); }
                req[modelName] = newModel;
                next();
            });
        }
    }
    
    ParticipantRepository.read = function(where) {
		where = where || function(req, res){ return {}; };
		return function(req, res, next) {
			var predicate = where(req, res);            
            var promise = Participant.find(predicate)
                .sort('-dateCreate');
			if(req.query.skip && req.query.take) {
                promise.skip(req.query.skip)
                    .limit(req.query.take)
            }
			
			promise.exec(function(err, result){
                if(err) { return next(err) }
				// if(!result) { return next(null, false); }
				var opts = [{ path: 'raceID', model: 'Race' }]
				Participant.populate(result, opts, function(pErr, popResult) {
					if(pErr) { return next(pErr) }
					Participant.find(predicate).count(function(cErr, count) {
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
	
    return ParticipantRepository; 
}