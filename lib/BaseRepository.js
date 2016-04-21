//
// Acts as a base repository prototype providing basic CRUD operations using the parameter callbacks.
// parameter: mongoose : Object
// - A mongoose instance.
// parameter: modelName : string
// - Name of the used model.
// paramter: callbacks : Object
// - Contains callbacks for the create-method and the update-method.
// - The create-method should
//
module.exports = function(mongoose, modelName, callbacks) {
    var Model = mongoose.model(modelName);
    var NotFoundError = new Error(`${modelName} was not found.`);
    NotFoundError.status = 404;
    
    this.create = function(req, res, next) {
        var newModel = new Model(callbacks.create(req, res));
        newModel.save(function(err) {
            if(err) { return next(err); }
            req[modelName] = newModel;
            next();
        });
    }
    
    this.read = function(req, res, next) {
        Model.find(function(err, result){
            if(err) { return next(err) }
            console.log(result);
            req[modelName] = result;
            next();
        });
    }
    
    this.readById = function(req, res, next) {
        Model.findOne({ "_id" : req.params.id },{},function(err, result){
            if(err) { return next(err) }
            if(result) {
                req[modelName] = result;
                next();
            }
            else {
                return next(NotFoundError);
            }
        });
    }
    
    this.update = function(req, res, next) {
        // req[model] should have the retrieved model
        if(!req[modelName]) { return next(NotFoundError); }
        
        // update properties of the model
        callbacks.update(req, res);
        
        req[modelName].save(function(err) {
            if(err) { return next(err); }
            req[modelName] = newModel;
            next();
        });
    }
    
    this.delete = function(req, res, next) {
        // req[model] should have the retrieved model
        if(!req[modelName]) { return next(NotFoundError); }
        
        req[modelName].remove();
        next();
    }
}