var express = require('express');
var router = express.Router({ mergeParams: true });

module.exports = function(waypointRepository, authHandler, request) {
	
	router.get("/waypoints", waypointRepository.read(function(req, res){ return { raceID: req.params.RaceId } }), function(req, res) {
		res.return({ result: req.Waypoint });
        // res.return({ result: [
        //     { raceID: req.params.id, place: { place_id: 'ChIJ868JyffuxkcRCBj2jwPPvc8' }  },
        //     { raceID: req.params.id, place: { place_id: 'ChIJdaHSJvTuxkcRhN90R_unXbM', name: 'leuven>?' }  },
        //     { raceID: req.params.id, place: { place_id: 'ChIJf94g6PbuxkcR1xA8cer7osc', name: "bij dirk" }  },
        //     { raceID: req.params.id, place: { place_id: 'ChIJ03DgufXuxkcRrQPAWOR0fzA', name: 'polleive' }  },
        // ] });
    });
    
    router.post("/waypoints", waypointRepository.model, function (req, res) {
        var API = "AIzaSyBnOX9RDvO8Te8BftCqZBTeA5-bGPuQYb4"; // todo: retrieve from config
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.body.pid + '&key=' + API;
        var place;

        console.log("wat is deze");

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(body);
                
                place = json.result;

                console.log(place);

                req.WaypointSchema.createWaypoint(req.params.id, place, req.body.comment, function(waypoint) {
                    console.log(waypoint)
                    res.status(201).end();
                });
            }
        }); 
    });
    
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
    });
	
	return router;
}