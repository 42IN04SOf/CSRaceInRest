var express = require('express');
var router = express.Router({ mergeParams: true });

module.exports = function(waypointRepository, raceRepository, authHandler, request, apiConfig) {
	
	router.param('RaceId', raceRepository.readById(function(req, res) { return req.params.RaceId }));
	
	// get waypoints	
	router.get("/:RaceId/waypoints",
		authHandler.isAuthorized('Waypoint-read'),
		waypointRepository.read(function(req, res){ return { raceID: req.params.RaceId } }),
		function(req, res) {
			res.return({ result: req.Waypoint });
		}
	);
	
	// add waypoints
	router.post("/:RaceId/waypoints",
		authHandler.isAuthorized('Waypoint-create'), 
		waypointRepository.model(),
		function (req, res) {
			var API = apiConfig.googleAuth.apiKey || "AIzaSyBnOX9RDvO8Te8BftCqZBTeA5-bGPuQYb4";
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
		}
	);
	
	// remove ALL waypoints from a race
	router.delete("/:RaceId/waypoints", 
	  	authHandler.isAuthorized('Waypoints-removeWhere'),
		waypointRepository.removeWhere(function(req, res) { return { raceID: req.params.RaceId }; }),
		function(req, res) {
			res.status(200).json({ status: 204, message: req.Waypoint + " deleted" });
		}
	);
	
	return router;
}