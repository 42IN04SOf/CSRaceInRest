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
        view: 'Races'
    },
    detail: {
        title: 'race.detailTitle',
        bag: { 
            getName: function(race) {
                return race.name;
            },
            active: 'race'
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
     
    router.delete("/:RaceId/state", 
        function(req, res) {
            req[model].stop();
            res.status(204).end();
        }
    );
    
    router.use('/', participantSubrouter);
    router.use('/', waypointSubrouter);
    
    return router;
}