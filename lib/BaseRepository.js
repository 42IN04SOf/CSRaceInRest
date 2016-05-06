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
module.exports = function(mongoose, modelName) {
    var Model = mongoose.model(modelName);
    var NotFoundError = new Error(`${modelName} was not found.`);
    NotFoundError.status = 404;
    
    // Puts the model on the request with key '{modelName}Schema'.
    var model = function() {
        return function(req, res, next) {
            req[modelName + 'Schema'] = Model;
            next();
        }
    }
    
    // Creates a database entry for the specified model.
    var create = function(params) {
        return function(req, res, next) {
            var newModel = new Model(params(req, res));
            newModel.save(function(err) {
                if(err) { return next(err); }
                req[modelName] = newModel;
                next();
            });
        }
    }
    
    // Puts the found results on the request with the modelName as key.
    var read = function(where) {
        where = where || function(req, res) { return {} };
        return function(req, res, next) {
            Model.find(where(req, res), function(err, result){
                if(err) { return next(err) }
                req[modelName] = result;
                next();
            });
        }
    }

    // Puts the found result on the request with the modelName as key.
    var readById = function(id) {
        return function(req, res, next) {
            Model.findOne({ "_id" : id(req, res) },{},function(err, result){
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
    }
    
    // Updates the found result and save the changes to the database.
    var update = function(updateParams) {
        return function(req, res, next) {
            // req[model] should have the retrieved model
            if(!req[modelName]) { return next(NotFoundError); }
            
            // update properties of the model
            updateParams(req, res);
            
            req[modelName].save(function(err) {
                if(err) { return next(err); }
                req[modelName] = newModel;
                next();
            });
        }
    }
    
    // Deletes the found result from the database.
    var remove = function() {
        return function(req, res, next) {
            // req[model] should have the retrieved model
            if(!req[modelName]) { return next(NotFoundError); }
            
            req[modelName].remove();
            next();
        }
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