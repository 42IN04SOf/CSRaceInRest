var express = require('express');
var router = express.Router();
var crudRouter = require('../lib/CrudRouter');

var model = 'User';
var html = {
    overview: {
        title: 'Users',
        message: 'User overview',
        view: 'Users'
    },
    detail: {
        title: 'User',
        message: `User detail`,
        view: 'User'
    }
};

module.exports = function(repository) {
	
	// add default routes
	crudRouter(router, model, repository, {
		read: true,
		create: true,
		readById: true,
		update: true,
		delete: true
	}, html);
	    
    return router;
}