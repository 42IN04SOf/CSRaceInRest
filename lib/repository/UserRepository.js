module.exports = function(mongoose, modelName) {
	var UserRepository = require('../BaseRepository')(mongoose, modelName);
	
    return UserRepository; 
}