module.exports = function(mongoose, modelName) {
	var WaypointRepository = require('../baseRepository')(mongoose, modelName, {
        create: function(req, res) {
            return {
                local: {
					email: req.body.email,
                	password: req.body.password
				}
            }
        },
        update: function(req, res) {
            req[modelName].local.email = req.body.email;
            req[modelName].local.password = req.body.password;
        }
    });
	
	// optional: Add more repository-methods
	WaypointRepository.test = function()
	{
		console.log('waypoint');	
	};
	
    return WaypointRepository; 
}