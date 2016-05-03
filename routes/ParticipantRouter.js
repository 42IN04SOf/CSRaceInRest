var express = require('express');
var router = express.Router();
var crudRouter = require('../lib/CrudRouter');

var model = 'Participant';
var html = {
    overview: {
        title: 'Participants',
        message: 'Participant overview',
        view: 'Participant'
    },
    detail: {
        title: 'Participant',
        message: `Participant detail`,
        view: 'Participant'
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