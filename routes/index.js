var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.return({ 
		result: { title: 'dota' }, 
		view: 'index'
	});
});

module.exports = router;
