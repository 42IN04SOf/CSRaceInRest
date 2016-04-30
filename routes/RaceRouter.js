var express = require('express');
var router = express.Router();
var crudRouter = require('../lib/CrudRouter');

var model = 'Race';
var html = {
    overview: {
        title: 'Races',
        message: 'Race overview',
        view: 'Races'
    },
    detail: {
        title: 'Race',
        message: `Race detail`,
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
            var color = require('../lib/module/colorizer');
            console.log(color.modify(['green', 'bgred'], 'your green text with red background'));
            req[model].start();
            res.status(204);
		}
    );
    
    // router.delete("/:id/state", 
    //     function(req, res) {
    //         console.log(req[model].asPublic());
    //         res.json(req[model].asPublic())
    //     },
    //     repository.update,
    //     function(req, res) {
	// 		res.send('updota');
	// 	}
    // );
    
    return router;
}