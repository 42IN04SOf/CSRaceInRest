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
				var opts = [{ path: 'raceID', model: 'Race' }, { path: 'userID', select: '_id local.email google.name', model: 'User' }]
				Participant.populate(result, opts, function(pErr, popResult) {
					if(pErr) { return next(pErr) }
					var innerOpts = [{ path: 'raceID.ownerID', select: '_id local.email google.name', model: 'User' }]
					Participant.populate(popResult, innerOpts, function(ppErr, innerPopResult) {
						if(ppErr) { return next(ppErr) }
						Participant.find(predicate).count(function(cErr, count) {
							if(cErr) { return next(cErr) }
							req[modelName] =  {
								count: count,
								result: innerPopResult
							};
							next();
						});
					})
				});
            });
		}
	}
	
    return ParticipantRepository; 
}