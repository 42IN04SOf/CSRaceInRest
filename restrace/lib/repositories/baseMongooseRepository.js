module.exports = function(mongoose, model, callbacks) {
    var Model = mongoose.model(model);
    var NotFoundError = new Error(`${model} was not found.`);
    NotFoundError.status = 404;
    
    
    this.create = function(req, res, next) {
        var newModel = new Model(callbacks.create(req, res));
        newModel.save(function(err) {
            if(err) { return next(err); }
            req[model] = newModel;
            next();
        });
    }
    
    this.read = function(req, res, next) {
        Model.find(function(err, result){
            if(err) { return next(err) }
            console.log(result);
            req[model] = result;
            next();
        });
    }
    
    this.readById = function(req, res, next) {
        Model.findOne({ "_id" : req.params.id },{},function(err, result){
            if(err) { return next(err) }
            if(result) {
                req[model] = result;
                next();
            }
            else {
                return next(NotFoundError);
            }
        });
    }
    
    this.update = function(req, res, next) {
        // req[model] should have the retrieved model
        if(!req[model]) { return next(NotFoundError); }
        
        // update properties of the model
        callbacks.update(req, res);
        req[model].save(function(err) {
            if(err) { return next(err); }
            req[model] = newModel;
            next();
        });
    }
    
    this.delete = function(req, res, next) {
        // req[model] should have the retrieved model
        if(!req[model]) { return next(NotFoundError); }
        
        req[model].remove();
        next();
    }
}