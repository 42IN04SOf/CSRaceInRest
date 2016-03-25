var express = require('express');
var router = express.Router();

var model = 'entity';
var html = {
    overview: {
        title: 'entities',
        message: 'entity overview',
        view: 'entities'
    },
    detail: {
        title: 'entity',
        message: `entity detail`,
        view: 'entity'
    }
};

module.exports = function(entityRepository) {
    // GET /entity
    router.get('/', entityRepository.read, function(req, res, next) {
        console.log(req[model]);
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.overview.title;
            req[model].message = html.overview.message;
        }
        res.return({ result: req[model], view: html.overview.view });
    });

    // POST /entity
    router.post('/', entityRepository.create, function(req, res) {
        res.sendStatus(201);
    });

    // ANY /entity/:id
    router.param('id', entityRepository.readById);

    // GET /entity/:id
    router.get('/:id', function (req, res){
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.detail.title;
            req[model].message = html.detail.message;
        }
        res.return({ result: req[model], view: html.detail.view });
    });

    // PUT /entity/:id
    router.put('/:id', entityRepository.update);

    // DELETE /entity/:id
    router.delete('/:id', entityRepository.delete);
    
    return router;
}
