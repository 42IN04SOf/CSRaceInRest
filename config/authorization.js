module.exports = function(mongoose, unAuthorizedError) {
	return [
		{
			keys: [	'Race-create', 'Race-read', 'Race-readById', 
					'Participant-create', 'Participant-read', 'Participant-readById',
					'Waypoint-read', 'Waypoint-readById'], 
			value: function(req, res, next) {
				return next();
			}
		},
		{
			keys: ['Race-update', 'Race-delete'], 
			value: function(req, res, next) {
				if(req.user && req.Race && (req.user.isAdmin() || req.Race.isOwner(req.user))) {
					return next();
				}
				return next(unAuthorizedError);
			}
		},
		{
			keys: ['Participant-update', 'Participant-delete'], 
			value: function(req, res, next) {
				if(req.user && req.Participant && (req.user.isAdmin() || req.Participant.isParticipant(req.user))) {
					return next();
				}
				return next(unAuthorizedError);
			}
		},
		{
			keys: ['User-create', 'User-delete'], 
			value: function(req, res, next) {
				if(req.user && req.User && req.user.isAdmin()) {
					return next();
				}
				return next(unAuthorizedError);
			}
		},
		{
			keys: ['User-read'],
			value: function(req, res, next) {
				if(req.user && req.user.isAdmin()) {
					return next();
				}
				return next(unAuthorizedError);
			}
		},
		{
			keys: ['User-readById', 'User-update'], 
			value: function(req, res, next) {
				if(req.user && req.User && (req.user.isAdmin() || req.User._id.equals(req.user._id))) {
					return next();
				}
				return next(unAuthorizedError);
			}
		},
		{
			keys: ['Waypoint-update', 'Waypoint-delete'], 
			value: function(req, res, next) {
				if(req.user && req.Waypoint) {
					req.Waypoint.populate('raceID', function(err, populatedWaypoint) {
						if(err) {
							return next(err);
						}
						if(req.user.isAdmin() || populatedWaypoint.isRaceOwner(req.user)) {
							return next();
						}
						return next(unAuthorizedError);
					})
				}
				return next(unAuthorizedError);
			}
		},
		{
			keys: ['Waypoint-create', 'Waypoints-removeWhere'],
			value: function(req, res, next) {
				if(req.Race.isOwner(req.user) || req.user.isAdmin()) {	
					return next();
				}
				return next(unAuthorizedError);
			}
		},
		{
			keys: ['Test-value'],
			value: function(req, res, next) {
				console.log('isAuthorized using Test-value');
				next();
			}
		}
	];
};