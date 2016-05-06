module.exports = function(mongoose, modelName) {
	var WaypointRepository = require('../baseRepository')(mongoose, modelName);
	
	// optional: Add more repository-methods
	WaypointRepository.test = function()
	{
		console.log('waypoint');	
	};
	
    return WaypointRepository; 
}