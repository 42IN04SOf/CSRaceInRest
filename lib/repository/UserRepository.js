module.exports = function(mongoose, modelName) {
	var UserRepository = require('../baseRepository')(mongoose, modelName);
	
	// optional: Add more repository-methods
	UserRepository.test = function()
	{
		console.log('user');	
	};
	
    return UserRepository; 
}