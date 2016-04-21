var express = require('express');
var router = express.Router();
var crudRouter = require('../lib/CrudRouter');

var model = 'Race';
var html = {
    overview: {
        title: 'entities',
        message: 'entity overview',
        view: 'entities'
    },
    detail: {
        title: 'entity',
        message: `entity detail`,
        view: 'entity'
    }
};

module.exports = function(repository) {
	
	// add default routes
	crudRouter(router, repository, {
		read: true,
		create: true,
		readById: true,
		update: true,
		delete: true
	}, html);
    
    return router;
}