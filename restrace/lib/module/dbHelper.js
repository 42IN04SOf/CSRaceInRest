module.exports = function(mongoose, dbConfig) {
    var self = this;    
    var middleware = require('./middleware');
    var schemaConfig = [
        '../schema/entity',
        '../schema/race',
        '../schema/waypoint'
    ];
    var repositoryConfig = [
        { key: 'entity', path:'../repositories/entityRepository' }
    ];
    
    var loadSchemas = function() {
        for(var i = 0; i < schemaConfig.length; i++) {
            require(schemaConfig[i])(mongoose, middleware);
        }
    }
    var initRepositories = function() {
        for(var i = 0; i < repositoryConfig.length; i++) {
            var repository = require(repositoryConfig[i].path);
            self.repositories[repositoryConfig[i].key] = repository(mongoose, repositoryConfig[i].key);
        }
    }
    
    mongoose.connect(dbConfig.connection, function(err) {
        if(err) {
            console.error(`error: ${err}`);
        }
        else {
            console.log('Succesfully connected to the database');
        }
    });
    self.repositories = {};
    loadSchemas();
    initRepositories();
}