var express                 = require('express');
var router                  = express.Router();

var crudRouter              = require('../lib/CrudRouter');
var waypointSubrouter       = require('./subrouter/WaypointSubrouter');
var participantSubrouter    = require('./subrouter/ParticipantSubrouter');

var model = 'Race';
var html = {
    overview: {
        title: 'race.overviewTitle',
        bag: { active: 'race' },
        view: 'races'
    },
    detail: {
        title: 'race.detailTitle',
        bag: { 
            getName: function(race) {
                return race.name;
            },
            active: 'race'
        },
        view: 'race'
    }
};

module.exports = function(
        raceRepository,
        participantRepository,
        waypointRepository, 
        authHandler,
        request,
        apiConfig,
        socketEmitter) {
            
    // init subrouters
    waypointSubrouter       = waypointSubrouter(waypointRepository, raceRepository, authHandler, request, apiConfig);
    participantSubrouter    = participantSubrouter(participantRepository, raceRepository, socketEmitter, authHandler); 
    
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
	}, html, authHandler);
    
    // start race
    router.post("/:RaceId/state",
        authHandler.isAuthorized('Race-update'),
        function(req, res) {
            req[model].start();
            socketEmitter.emitToRace(req.params.RaceId, {
                user: 'server',
                message: 'The race has started',
                type: 'room',
                code: 'start'
            });
            res.status(204).end();
		}
    );
    
    // stop race
    router.delete("/:RaceId/state",
        authHandler.isAuthorized('Race-update'),
        function(req, res) {
            req[model].stop();
            socketEmitter.emitToRace(req.params.RaceId, {
                user: 'server',
                message: 'The race has stopped',
                type: 'room',
                code: 'stop'
            });
            res.status(204).end();
        }
    );
    
    // participant routes
    router.use('/', participantSubrouter);
    // waypoint routes
    router.use('/', waypointSubrouter);
    
    return router;
}