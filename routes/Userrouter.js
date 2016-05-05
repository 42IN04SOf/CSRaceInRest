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

module.exports = function(repository, participantRepository, raceRepository, authHandler) {
	
	// add default routes
	crudRouter(router, model, repository, {
		read: true,
		create: true,
		readById: true,
		update: true,
		delete: true
	}, html);
	
    router.get('/:id/participatingraces', participantRepository.model, function(req, res) {
        req.Model.getParticipantsByUserId(req.params.id, function(err, participant) {
            if(err) {
               res.status(403).end();
            } else {
               res.return({ result: participant });
            }
        });
    });
    
    router.get('/:id/owningraces', raceRepository.model, function(req, res) {
        console.log(req.Model);
        
        req.Model.getRacesAsOwner(req.params.id, function(err, races) {
            if(err) {
               res.status(403).end();
            } else {
               res.return({ result: races });
            }
        });
    });
    
    return router;
}