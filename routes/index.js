var express = require('express');
var router = express.Router();

module.exports = function(authHandler) {
	
	router.get('/', function(req, res) {
		if(req.user) {
			console.log('user exists');
		}
		res.return({ 
			result: { title: 'index.title', bag: { active: 'home' } }, 
			view: 'index'
		});
	});

	router.get('/profile',
	 	authHandler.isAuthenticated(),
		function(req, res, next) {
			if(res.isHTMLRequested()) {
				console.log(req.user);
				return res.return({ 
					result: { title: 'index.title', user: req.user.asPublic(), bag: { active: 'profile' } }, 
					view: 'profile'
				});
			}
			return next();
		}
	);
	
	return router;
};
