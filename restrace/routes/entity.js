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

// GET /entity
router.get('/', function(req, res) {
    var Model = req.mongoose.model(model);
    Model.find(function(err, result){
        if(err) {
            res.error(400, `${model} could not be retrieved, ${err}.`);
        }
        else {
            if(res.isHTMLRequested()) {
                result = { result: result };
                result.title = html.overview.title;
                result.message = html.overview.message;
            }
            res.return(result, html.overview.view);
        }
    });
});

// POST /entity/
// request-body to model
router.post('/', function(req, res, next) {
    var Model = req.mongoose.model(model);
    var mModel = new Model({
        name    : req.body.name,
        rating  : req.body.rating
    });
    req[model] = mModel;
    next();
});

// POST /entity/
// store model and return statuscode
router.post('/', function(req, res) {
    req[model].save(function(err) {
        if(err) {
            res.error(500, `${model} could not be saved, ${err}.`);
        }
        else {
            res.sendStatus(201);
        }
    });
});

// ANY /entity/:id
// retrieve model from id
router.param('id', function(req, res, next, id) {
    var Model = req.mongoose.model(model);
    var modelId = req.params.id;
    Model.findOne({ "_id" : modelId },{},function(err, result){
        if(err) {
            res.error(500, `${model} could not be retrieved, ${err}.`);
        }
        else if(result) {
            req[model] = result;
            next();
        }
        else {
            res.error(404, `${model} does not exist.`);
        }
    });
});

// GET /entity/:id
// return entity from id
router.get('/:id', function (req, res){
    if(res.isHTMLRequested()) {
        req[model] = { result: req[model] };
        req[model].title = html.overview.title;
        req[model].message = html.overview.message;
    }    
    res.return(req[model], html.detail.view);
});

// PUT /entity/:id
// assign req.body to entity
router.put('/:id', function (req, res, next){
    if(req.query.partial) {
        if(req.body.name) {
            req[model].name = req.body.name;
        }
        if(req.body.rating) {
            req[model].rating = req.body.rating;
        }
    }
    else {
        req[model].name = req.body.name;
        req[model].rating = req.body.rating;
    }
    next();
});

// PUT /entity/:id
// save entity
router.put('/:id', function (req, res){
    req[model].save(function(err) {
        if(err) {
            res.error(500, `${model} could not be updated, ${err}.`);
        }
        else {
            res.sendStatus(204);
        }
    });
});

// DELETE /entity/:id
router.delete('/:id', function(req, res) {
    req[model].remove();
    res.sendStatus(204);
});

module.exports = router;
