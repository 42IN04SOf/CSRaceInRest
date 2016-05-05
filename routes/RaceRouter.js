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

module.exports = function(raceRepository, participantRepository, waypointRepository, authHandler, request) {
	
	// add default routes
	crudRouter(router, model, raceRepository, {
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
            req[model].popOwner((err, poppedRace) => { 
                console.log(err);
                console.log(poppedRace);
                res.send('ggnore');
            });
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
    
    router.post("/:id/waypoints", waypointRepository.model, function (req, res) {
        var API = "AIzaSyBnOX9RDvO8Te8BftCqZBTeA5-bGPuQYb4";
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.body.pid + '&key=' + API;
        var place;
        //console.log(url);

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
    })
    
    router.delete("/:id/waypoints", waypointRepository.model, function (req, res) {
        if(req.body.wid) {
            req.Model.deleteWaypoint(req.body.wid, function(err) {
                if(err) {
                    console.log(err);
                    res.status(403).end(); 
                } else {
                    res.status(200).end();
                }
            })
        } else {
            res.status(403).end();
        }
    })
    
    return router;
}