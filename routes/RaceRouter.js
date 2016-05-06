var express                 = require('express');
var router                  = express.Router();

var crudRouter              = require('../lib/CrudRouter');
var waypointSubrouter       = require('./subrouter/WaypointSubrouter');
var participantSubrouter    = require('./subrouter/ParticipantSubrouter');

var model = 'Race';
var html = {
    overview: {
        title: 'race.overviewTitle',
        bag: 'Race overview',
        view: 'Races'
    },
    detail: {
        title: 'race.detailTitle',
        bag: { 
            getName: function(race) {
                return race.name;
            }
        },
        view: 'Race'
    }
};

module.exports = function(raceRepository, participantRepository, waypointRepository, authHandler, request) {
	
    // init subrouters
    waypointSubrouter       = waypointSubrouter(waypointRepository, authHandler, request);
    participantSubrouter    = participantSubrouter(participantRepository, authHandler); 
    
	// add default routes
	crudRouter(router, model, raceRepository, {
		read: function(req, res) { return {}; },
		create: function(req, res){ 
            return { 
                name: req.body.name,
                ownerID: req.user._id 
            };
        },
		readById: function(req, res) {
            return req.params.RaceId; 
        },
		update: function(req, res) {
            req.Race.name = req.body.name;
        },
		delete: true
	}, html);
    
    router.post("/:RaceId/state",
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
    
    router.put("/:id/participants/:pid/waypoints", participantRepository.model, authHandler.isAuthenticated(), function (req, res, next) {
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
            if (authHandler.isAuthorized('Participant-update')) {
                req.Participant.addCompletedWaypoint(req.body.wid, function (err) {
                    console.log(req.body);
                    if (err) {
                        res.status(403).end();
                    } else {
                        res.status(200).end();
                    }
                });
            } else {
                res.status(401).end();
            }
        })
    
    router.post("/:id/waypoints", waypointRepository.model, authHandler.isAuthenticated(), function (req, res) {
        var API = "AIzaSyBnOX9RDvO8Te8BftCqZBTeA5-bGPuQYb4";
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.body.pid + '&key=' + API;
        var place;
        //console.log(url);

        if (authHandler.isAuthorized('Waypoint-create')) {
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log(body);
                    var json = JSON.parse(body);

                    place = json.result;

                    console.log(place);

                    req.Model.createWaypoint(req.params.id, place, req.body.comment, function (waypoint) {
                        console.log(waypoint)
                        res.status(201).end();
                    });
                }
            });
        } else {
            res.status(401).end();
        }
    })

    router.use('/:RaceId', participantSubrouter);
    router.use('/:RaceId', waypointSubrouter);
    
    router.delete("/:id/waypoints", waypointRepository.model, authHandler.isAuthenticated(), function (req, res) {
        if (authHandler.isAuthorized('Waypoint-delete')) {
            if (req.body.wid) {
                req.Model.deleteWaypoint(req.body.wid, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(403).end();
                    } else {
                        res.status(200).end();
                    }
                })
            } else {
                res.status(403).end();
            }
        } else {
            res.status(401).end();
        }

    })

    return router;
}