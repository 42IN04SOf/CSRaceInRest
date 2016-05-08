var express = require('express');
var router = express.Router();

module.exports = function(authHandler) {
	
	router.get('/', function(req, res) {
		res.return({ 
			result: { title: 'index.title', bag: { active: 'home' } }, 
			view: 'index'
		});
	});

	router.get('/profile',
	 	authHandler.isAuthenticated(),
		function(req, res, next) {
			var result = req.user.asPublic();
			if(res.isHTMLRequested()) {
				result = { user: result }
				result.title = 'index.title';
				result.bag = { active: 'profile' };
			}
			return res.return({ 
				result: result,
				view: 'profile'
			});
		}
	);
	
	return router;
};
