var express = require('express');
var router = express.Router();

var model = 'waypoint';
var html = {
    overview: {
        title: 'waypoints',
        message: 'waypoint overview',
        view: 'waypoints'
    },
    detail: {
        title: 'waypoint',
        message: `waypoint detail`,
        view: 'waypoint'
    }
};

module.exports = function(waypointRepository) {
    // GET /waypoint
    router.get('/', waypointRepository.read, function(req, res, next) {
        console.log(req[model]);
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.overview.title;
            req[model].message = html.overview.message;
        }
        res.return({ result: req[model], view: html.overview.view });
    });

    // POST /waypoint
    router.post('/', waypointRepository.create, function(req, res) {
        res.sendStatus(201);
    });

    // ANY /waypoint/:id
    router.param('id', waypointRepository.readById);

    // GET /waypoint/:id
    router.get('/:id', function (req, res){
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.detail.title;
            req[model].message = html.detail.message;
        }
        res.return({ result: req[model], view: html.detail.view });
    });

    // PUT /waypoint/:id
    router.put('/:id', waypointRepository.update, function(req, res) {
        res.sendStatus(204);
    });

    // DELETE /waypoint/:id
    router.delete('/:id', waypointRepository.delete, function(req, res) {
        res.sendStatus(204);
    });
    
    return router;
}
