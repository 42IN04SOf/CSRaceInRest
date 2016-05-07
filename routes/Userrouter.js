var express = require('express');
var router = express.Router();
var crudRouter = require('../lib/CrudRouter');

var model = 'User';
var html = {
    overview: {
        title: 'Users',
        bag: { active: 'user' },
        view: 'Users'
    },
    detail: {
        title: 'User',
        bag: { active: 'user' },
        view: 'User'
    }
};

module.exports = function(repository, participantRepository, raceRepository, authHandler) {
	
	// add default routes
	crudRouter(router, model, repository, {
		read: function(req, res) { return {}; },
		create: false,
		readById: function(req, res) {
            return req.params.UserId; 
        },
		update: function(req, res) {
            req.User.name = req.body.name;
        },
		delete: false
	}, html);
	
    router.get('/:UserId/participatingraces', participantRepository.model(), authHandler.isAuthenticated(), function(req, res) {
        req.ParticipantSchema.getParticipantsByUserId(req.params.id, function(err, participant) {
            if(err) {
               res.status(403).end();
            } else {
               res.return({ result: participant });
            }
        });
    });
    
    router.get('/:UserId/owningraces', authHandler.isAuthenticated(),
        raceRepository.read(function(req, res){ return { ownerID: req.params.UserId } }),
        function(req, res) {
            res.return({ result: req.Race });
        }
    );
    
    return router;
}