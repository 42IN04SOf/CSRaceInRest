var express = require('express');
var router = express.Router();

var model = 'user';
var html = {
    overview: {
        title: 'users',
        message: 'users overview',
        view: 'users'
    },
    detail: {
        title: 'user',
        message: 'user detial',
        view: 'user'
    }
};

module.exports = function() {
    // GET /user
    router.get('/', userRepository.read, function(req, res, next) {
        console.log(req[model]);
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.overview.title;
            req[model].message = html.overview.message;
        }
        res.return({ result: req[model], view: html.overview.view });
    });
    
    // POST /user
    router.post('/', userRepository.create, function(req, res) {
        res.sendStatus(201);
    });
    
    // ANY /user/:id
    router.param('id', userRepository.readById);
    
    // GET /user/:id
    router.get('/:id', function (req, res){
        if(res.isHTMLRequested()) {
            req[model] = { result: req[model] };
            req[model].title = html.detail.title;
            req[model].message = html.detail.message;
        }
        res.return({ result: req[model], view: html.detail.view });
    });
    
    // PUT /user/:id
    router.put('/:id', userRepository.update, function(req, res) {
        res.sendStatus(204);
    });
    
    // DELETE /user/:id
    router.delete('/:id', userRepository.delete, function(req, res) {
        res.sendStatus(204);
    });
    
    return router;
};
