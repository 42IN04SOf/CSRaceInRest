// A module which initializes, prepares and serves the database-related components.
//
// - connects the database.
// - loads the configured mongoose-schemas.
// - initializes the repositories.
//
module.exports = function(mongoose, config) {
	// initialization
    var self = this;
	self.repositories = {};
	
	// initialize database connection
    mongoose.connect(config.url, function(err) {
        if(err) {
            console.error(`error: ${err}`);
        }
        else {
            console.log('Succesfully connected to the database');
        }
    });
	
	// prepare and serve database components
    for(var i = 0; i < config.entities.length; i++) {
		// load schema and init to mongoose instance
		require(config.entities[i].schemaPath)(mongoose);
		// load repository
		var repository = require(config.entities[i].repositoryPath);
		// serve repository
		self.repositories[config.entities[i].key] = repository(mongoose, config.entities[i].key);
	}
}