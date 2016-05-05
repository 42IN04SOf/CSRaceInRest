var express         = require('express');
var router          = express.Router();

var crudRouter      = require('../lib/CrudRouter');

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

module.exports = function(repository, authHandler) {
    
	// add default routes
	crudRouter(router, model, repository, {
		read: true,
		create: true,
		readById: true,
		update: true,
		delete: true
	}, html);
    
    router.get('/:id/testdelete',
        authHandler.isAuthorized('Race-create'),
        //repository.model,
        function(req, res) {
            req[model].popOwner((err, poppedRace) => { 
                console.log(err);
                console.log(poppedRace);
                res.send('ggnore');
            });
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