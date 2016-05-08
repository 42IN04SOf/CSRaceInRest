var express = require('express');
var router = express.Router({ mergeParams: true });

module.exports = function(participantRepository, raceRepository, socketEmitter, authHandler) {
	
    router.param('RaceId', raceRepository.readById(function(req, res) { return req.params.RaceId }));
    
    // get list of participants
	router.get('/:RaceId/participants',
        authHandler.isAuthorized('Participant-read'),
        participantRepository.read(function(req, res) { return { raceID: req.params.RaceId } }),
        function(req, res) {
            var publicData = req.Participant;
            if(Array.isArray(req.Participant.result)) {
                publicData = {};
				publicData.count = req.Participant.count;
				publicData.result = [];
				for(element of req.Participant.result) {
					publicData.result.push(element.asPublic());
				}
			}
            
            return res.return({ result: publicData });
        }
    );
    
    // join race
    router.post('/:RaceId/participants', 
        authHandler.isAuthorized('Participant-create'),
        function(req, res, next) {
            console.log(req);
            if(req.Race.dateStart) {
                var err = new Error('race.alreadyStarted');
                err.status = 400;
                throw err;
            }
            return next();
        },
        participantRepository.create(function(req, res) { return { userID: req.user._id, raceID: req.params.RaceId } }),
        function(req, res) {
            console.log(req.Participant);
            res.return({ result: req.Participant.asPublic() });
        }
    );
    
    // complete waypoint
    router.put("/:RaceId/participants/:pid/waypoints",
        participantRepository.readById(function(req, res){ return req.params.pid }),
        authHandler.isAuthorized('Participant-update'),
        function(req, res, next) {
            if(req.Race.dateStop) {
                var err = new error('race.alreadyStopped');
                err.status = 400;
                throw err;
            }
            return next();
        }, 
        function(req, res) {
            req.Participant.addCompletedWaypoint(req.body.wid, function(err) {
                console.log(req.body);
                if(err) {
                    res.status(403).end();
                } else {
                    socketEmitter.emitToRace(req.params.RaceId, {
                        user: 'server',
                        message: 'A user has completed a new waypoint',
                        type: 'room',
                        code: 'waypointCompleted'
                    });
                    res.status(200).end();
                }
            });
        }
    )
	
	return router;
}