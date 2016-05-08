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
	}, html, authHandler);
	
    // router.get('/:UserId/participatingraces', participantRepository.model(), authHandler.isAuthenticated(), function(req, res) {
    //     req.ParticipantSchema.getParticipantsByUserId(req.params.id, function(err, participant) {
    //         if(err) {
    //            res.status(403).end();
    //         } else {
    //            res.return({ result: participant });
    //         }
    //     });
    // });
    
    // get races where user is participating
    router.get('/:UserId/participatingraces',
        authHandler.isAuthorized('Race-read'),
        participantRepository.read(function(req, res) { return { userID: req.params.UserId } }),
        function(req, res) {
            res.return({ result: req.Participant });
        }
    );
    
    // get races where user is owner
    router.get('/:UserId/owningraces', authHandler.isAuthorized('Race-read'),
        raceRepository.read(function(req, res){ return { ownerID: req.params.UserId } }),
        function(req, res) {
            res.return({ result: req.Race });
        }
    );
    
    // get specific race where user is owner
    router.get('/:UserId/owningraces/:RaceId', authHandler.isAuthorized('Race-read'),
        raceRepository.readById(function(req, res){ return req.params.RaceId }),
        function(req, res) {
            //console.log(req.user._id.equals(req.Race.ownerID._id));
            if(req.user._id.equals(req.Race.ownerID._id)) {
                var result = req.Race;
                if(res.isHTMLRequested()) {
                    result = { data: result};
                    result.title = 'race.ownedTitle';
                    result.bag = { active: 'race' };
                }
                return res.return({ result: result, view: 'raceOwned' });
            }
            var err = new Error('global.badRequest');
            err.status = 400;
            throw err;
        }
    );
    
    return router;
}