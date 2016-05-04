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

module.exports = function(raceRepository, participantRepository) {
	
	// add default routes
	crudRouter(router, model, raceRepository, {
		read: true,
		create: true,
		readById: true,
		update: true,
		delete: true
	}, html);
    
    router.post('/:id/test',
        authModule.isAuthenticated(model),
        raceRepository.model, 
        function(req, res) {
            req['Model'].test();
        }
    )
    
    router.get('/:id/test',
        authModule.isAuthorized(model),
        raceRepository.model, 
        function(req, res) {
            req['Model'].test();
        }
    )
    
    router.post("/:id/state",
        raceRepository.test,
        function(req, res) {
            req[model].start();
            res.status(204).end();
		}
    );
     
    router.delete("/:id/state", 
        function(req, res) {
            req[model].stop();
            res.status(204).end();
        }
    );
    
    router.get('/:id/participants', participantRepository.model, function(req, res) {
        console.log(req.Race);
        req.Model.getParticipantsByRaceId(req.Race._id, function(err, participants) {
            console.log(err);
            console.log(participants)
            if(err) {
               res.status(403).end();
            } else {
               res.return({ result: participants });
            }
        });
    });
    
    router.put("/:id/participants/:pid/waypoints", participantRepository.model, function (req, res, next) {
        req.Model.findOne({ "_id": req.params.pid }, {}, function (err, result) {

            if (err) {
                if (err.name === 'CastError' && err.type === 'ObjectId') { // Here or @Errorhandler???
                    err.status = 404;
                    err.oldMessage = err.message;
                    err.message = 'global.notFound';
                }
                return next(err)
            }
            if (result) {
                req["Participant"] = result;
                next();
            }
            else {
                return next(NotFoundError);
            }
        });
    }, function(req, res) {
        req.Participant.addCompletedWaypoint(req.body.wid, function(err) {
            console.log(req.body);
            if(err) {
                res.status(403).end();
            } else {
                res.status(200).end();
            }
        });
    })
    
    return router;
}