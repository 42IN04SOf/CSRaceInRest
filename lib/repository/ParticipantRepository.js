module.exports = function(mongoose, modelName) {
	var ParticipantRepository = require('../baseRepository')(mongoose, modelName);
	
	// optional: Add more repository-methods
	ParticipantRepository.test = function()
	{
		console.log('particpant');	
	};
	
    return ParticipantRepository; 
}