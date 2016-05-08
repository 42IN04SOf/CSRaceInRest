module.exports = function(User) {
	var unAuthenticatedError = new Error('global.notAuthenticated');
	unAuthenticatedError.status = 401;
	var getTokenFromRequest = function(req) {
		return req.query.format === 'json'
			? req.query.token // <------------------------------ ONLY USE TOKEN WHEN JSON IS REQUESTED
			: undefined;
	}
	var middleware = function(req, res, next) {
		if(req.user) { return next(); }
		if(!getTokenFromRequest(req)) { return next(); } // if no token and no user, do nothing
		User.findOne({ 'local.token': getTokenFromRequest(req) }, function(err, user) {
			if(err) { return next(err); }
			if(!user) { return next(unAuthenticatedError); }
			req.user = user;
			next();
		});
	}
	return {
		middleware: middleware
	};
}