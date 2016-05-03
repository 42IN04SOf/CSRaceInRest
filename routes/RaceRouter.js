var express = require('express');
var router = express.Router();

var crudRouter = require('../lib/CrudRouter');
var authModule = require('../lib/module/authModule');

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
    
    router.post('/:id/test',
        authModule.isAuthenticated(model),
        repository.model, 
        function(req, res) {
            req['Model'].test();
        }
    )
    
    router.get('/:id/test',
        authModule.isAuthorized(model),
        repository.model, 
        function(req, res) {
            req['Model'].test();
        }
    )
    
    router.post("/:id/state",
        repository.test,
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