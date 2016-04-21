module.exports = function(mongoose, modelName) {
	var WaypointRepository = require('../baseRepository');
	
	// optional: Add more repository-methods
	WaypointRepository.prototype.test = function()
	{
		console.log('dota');	
	};
	
    return new WaypointRepository(mongoose, modelName, {
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
}