var colorizer = require('./colorizer');

module.exports = function(mongoose, config) {
	var unAuthenticatedError = new Error('global.notAuthenticated');
	unAuthenticatedError.status = 401;
	var unAuthorizedError = new Error('global.notAuthorized');
	unAuthorizedError.status = 403;
	
	config = config(mongoose, unAuthorizedError);
	
	var isAuthenticated = function() {
		return function(req, res, next) {	
			if(req.user) {
				return next();
			}
			return next();
		}
	}
	var isAuthorized = function(action) {
		for(middleware of config) {
			for(key of middleware.keys) {
				if(key === action) {
					return middleware.value;
				}
			}
		}
		
		// return config[modelName][action];
	}
	return {
		isAuthenticated: isAuthenticated,
		isAuthorized: function(action) {
			return [isAuthenticated(), isAuthorized(action)];
		},
	}
};