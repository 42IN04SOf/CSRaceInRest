var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/pancake/:id/hookie', function(req, res, next) {
	if(req.user) {
		console.log('user exists');
	}
	res.return({ 
		result: { title: req.params.id, raceID: req.params.id }, 
		view: 'index'
	});
});

module.exports = router;
