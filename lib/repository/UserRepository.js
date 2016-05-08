module.exports = function(mongoose, modelName) {
	var UserRepository = require('../baseRepository')(mongoose, modelName);
	
    return UserRepository; 
}