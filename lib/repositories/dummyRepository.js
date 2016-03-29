module.exports = function(model, callbacks) {
    var data = [];
    var NotFoundError = new Error(`${model} was not found.`);
    NotFoundError.status = 404;
    
    
    this.create = function(req, res, next) {
        var newModel = callbacks.create(req, res);
        data.push(newModel);
        next();
    }
    
    this.read = function(req, res, next) {
        req[model] = data;
        next();
    }
    
    this.readById = function(req, res, next) {
        for(var i =0; i< data.length; i++) {
           if(data[i].id === req.params.id) {
               req[model] = data[i];
               return next();
           } 
        }
        return next(NotFoundError);
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