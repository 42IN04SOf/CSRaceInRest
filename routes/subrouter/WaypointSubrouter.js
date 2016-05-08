var express = require('express');
var router = express.Router({ mergeParams: true });

module.exports = function(waypointRepository, authHandler, request) {
		
	router.get("/:RaceId/waypoints",
		waypointRepository.read(function(req, res){ return { raceID: req.params.RaceId } }),
		function(req, res) {
			res.return({ result: req.Waypoint });
		}
	);
	
	router.post("/:RaceId/waypoints", waypointRepository.model(), function (req, res) {
		var API = "AIzaSyBnOX9RDvO8Te8BftCqZBTeA5-bGPuQYb4"; // todo: retrieve from config
		var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.body.pid + '&key=' + API;
		var place;

		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				
				var json = JSON.parse(body);
				place = json.result;
				
				// todo req.body.comment
				return req.WaypointSchema.createWaypoint(req.params.RaceId, place, 'comment', function (waypoint) {
					var status = 201;
					res.status(status).json({ status: status, message: 'success' });
				});
			}
			throw error;
		}); 
	});
	
	// remove ALL waypoints from a race, not one
	router.delete("/:RaceId/waypoints", 
	  	authHandler.isAuthorized('Waypoints-removeWhere'),
		waypointRepository.removeWhere(function(req, res) { return { raceID: req.params.RaceId }; }),
		function(req, res) {
			res.status(200).json({ status: 204, message: req.Waypoint + " deleted" });
		}
	);
	
	return router;
}