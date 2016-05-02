var express = require('express');
var router = express.Router();
var crudRouter = require('../lib/CrudRouter');

var model = 'Race';
var html = {
    overview: {
        title: 'race.overviewTitle',
        bag: 'Race overview',
        view: 'Races'
    },
    detail: {
        title: 'race.detailTitle',
        bag: `Race detail`,
        view: 'Race'
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
    
    router.get("/:id/state", 
        function(req, res) {
            req[model].start();
            res.status(204);
		}
    );
    
    router.delete("/:id/state", 
        function(req, res) {
            req[model].stop();
            res.status(204);
        }
    );
    
    return router;
}