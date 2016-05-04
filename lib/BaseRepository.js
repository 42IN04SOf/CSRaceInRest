//
// Acts as a base repository prototype providing basic CRUD operations using the parameter callbacks.
// mongoose : Object
// - A mongoose instance.
// modelName : string
// - Name of the used model.
// callbacks : Object
// - Contains callbacks for the create-method and the update-method.
// - The create-method should return the model properties that need to be filled.
// - The update-method should update the model from the request.
//
module.exports = function(mongoose, modelName, callbacks) {
    var Model = mongoose.model(modelName);
    var NotFoundError = new Error(`${modelName} was not found.`);
    NotFoundError.status = 404;
    
    // Puts the model on the request with key 'Model'.
    var model = function(req, res, next) {
        req['Model'] = Model;
        next();
    }
    
    // Creates a database entry for the specified model.
    var create = function(req, res, next) {
        var newModel = new Model(callbacks.create(req, res));
        newModel.save(function(err) {
            if(err) { return next(err); }
            req[modelName] = newModel;
            next();
        });
    }
    
    // Puts the found results on the request with the modelName as key.
    var read = function(req, res, next) {
        Model.find(function(err, result){
            if(err) { return next(err) }
            req[modelName] = result;
            next();
        });
    }
    
    // Puts the found result on the request with the modelName as key.
    var readById = function(req, res, next) {
        Model.findOne({ "_id" : req.params.id },{},function(err, result){
            if(err) {
                if(err.name === 'CastError' && err.type === 'ObjectId') { // Here or @Errorhandler???
                    err.status = 404;
                    err.oldMessage = err.message;
                    err.message = 'global.notFound';
                } 
                return next(err)
            }
            if(result) {
                req[modelName] = result;
                next();
            }
            else {
                return next(NotFoundError);
            }
        });
    }
    
    // Updates the found result and save the changes to the database.
    var update = function(req, res, next) {
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
    
    // Deletes the found result from the database.
    var remove = function(req, res, next) {
        // req[model] should have the retrieved model
        if(!req[modelName]) { return next(NotFoundError); }
        
        req[modelName].remove();
        next();
    }
    
    return {
        model: model,
        create: create,
        read: read,
        readById: readById,
        update: update,
        remove: remove
    };
}