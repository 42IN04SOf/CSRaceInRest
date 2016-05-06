// authHandler that mocks that the user is always authenticated AND authorized.

module.exports = function() {
	var isAuthenticated = function(modelName) {
		return function(req, res, next) {
			return next();
		}
	}
	var isAuthorized = function(action) {
		return function(req, res, next) {
			return next();
		}
	}
	return {
		isAuthenticated: isAuthenticated,
		isAuthorized: function(modelName, action) {
			return [isAuthenticated(modelName), isAuthorized(action)];
		},
	}
};