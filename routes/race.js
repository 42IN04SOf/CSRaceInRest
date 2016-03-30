var express = require('express');
var router = express.Router();

var model = 'race';
var html = {
    overview: {
        title: 'races',
        message: 'races overview',
        view: 'races'
    },
    detail: {
        title: 'race',
        message: 'race detial',
        view: 'race'
    }
};

module.exports = function(raceRepository) {
    // GET /race
    router.get('/', raceRepository.read, function(req, res, next) {
        console.log(req[model]);
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.overview.title;
            req[model].message = html.overview.message;
        }
        res.return({ result: req[model], view: html.overview.view });
    });
    
    // POST /race
    router.post('/', raceRepository.create, function(req, res) {
        res.sendStatus(201);
    });
    
    // ANY /race/:id
    router.param('id', raceRepository.readById);
    
    // GET /race/:id
    router.get('/:id', function (req, res){
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.detail.title;
            req[model].message = html.detail.message;
        }
        res.return({ result: req[model], view: html.detail.view });
    });
    
    // PUT /race/:id
    router.put('/:id', raceRepository.update, function(req, res) {
        res.sendStatus(204);
    });
    
    // DELETE /race/:id
    router.delete('/:id', raceRepository.delete, function(req, res) {
        res.sendStatus(204);
    });
    
    return router;
};
