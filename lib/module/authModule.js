module.exports = (function() {
	return {
		isAuthorized: function(model) {
			return function(req, res, next) {
				var user = req.user;
				// do stuff
				next();
			}
		},
		isAuthenticated: function(model) {
			return function(req, res, next) {				
				var model = req[model];
				var user = req.user;
				// todo stuffs
				next();
			}
		}
	}
})();


