var express = require('express');
var router = express.Router();

var model = 'stats';
var html = {
    overview: {
        title: 'stats',
        message: 'stats overview',
        view: 'stats'
    },
    detail: {
        title: 'stats',
        message: `stats detail`,
        view: 'stats'
    }
};

module.exports = function(statsRepository) {
    // GET /stats
    router.get('/', statsRepository.read, function(req, res, next) {
        console.log(req[model]);
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.overview.title;
            req[model].message = html.overview.message;
        }
        res.return({ result: req[model], view: html.overview.view });
    });

    // POST /stats
    router.post('/', statsRepository.create, function(req, res) {
        res.sendStatus(201);
    });

    // ANY /stats/:id
    router.param('id', statsRepository.readById);

    // GET /stats/:id
    router.get('/:id', function (req, res){
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.detail.title;
            req[model].message = html.detail.message;
        }
        res.return({ result: req[model], view: html.detail.view });
    });

    // PUT /stats/:id
    router.put('/:id', statsRepository.update, function(req, res) {
        res.sendStatus(204);
    });

    // DELETE /stats/:id
    router.delete('/:id', statsRepository.delete, function(req, res) {
        res.sendStatus(204);
    });
    
    return router;
}
