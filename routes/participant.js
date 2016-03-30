var express = require('express');
var router = express.Router();

var model = 'participant';
var html = {
    overview: {
        title: 'participants',
        message: 'participant overview',
        view: 'participants'
    },
    detail: {
        title: 'participant',
        message: `participant detail`,
        view: 'participant'
    }
};

module.exports = function(participantRepository) {
    // GET /participant
    router.get('/', participantRepository.read, function(req, res, next) {
        console.log(req[model]);
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.overview.title;
            req[model].message = html.overview.message;
        }
        res.return({ result: req[model], view: html.overview.view });
    });

    // POST /participant
    router.post('/', participantRepository.create, function(req, res) {
        res.sendStatus(201);
    });

    // ANY /participant/:id
    router.param('id', participantRepository.readById);

    // GET /participant/:id
    router.get('/:id', function (req, res){
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.detail.title;
            req[model].message = html.detail.message;
        }
        res.return({ result: req[model], view: html.detail.view });
    });

    // PUT /entity/:id
    router.put('/:id', participantRepository.update, function(req, res) {
        res.sendStatus(204);
    });

    // DELETE /entity/:id
    router.delete('/:id', participantRepository.delete, function(req, res) {
        res.sendStatus(204);
    });
    
    return router;
}
