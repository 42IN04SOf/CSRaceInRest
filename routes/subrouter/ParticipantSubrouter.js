var express = require('express');
var router = express.Router({ mergeParams: true });

module.exports = function(participantRepository, authHandler) {
	
	router.get('/participants',
        participantRepository.read(function(req, res) { return { raceID: req.params.RaceId } }),
        function(req, res) {
            console.log(req.Participant)
            if(err) {
                res.status(403).end();
            } else {
                res.return({ result: req.Participant });
            }
        }
    );
    
    router.post('/participants', 
        // authHandler.isAuthorized('Participant-create'),
        function(req, res) {
            req[model].addParticipant(req.user._id, function(err, createdParticipant) {
                if(err) {
                res.status(403).end();
                }
                else {
                    res.return({ result: createdParticipant.asPublic() });
                }
            });
        }
    );
    
    router.put("/participants/:pid/waypoints", 
        participantRepository.readById(function(req, res){ return { "_id": req.params.pid }; }), 
        function(req, res) {
            req.Participant.addCompletedWaypoint(req.body.wid, function(err) {
                console.log(req.body);
                if(err) {
                    res.status(403).end();
                } else {
                    res.status(200).end();
                }
            });
        }
    )
	
	return router;
}