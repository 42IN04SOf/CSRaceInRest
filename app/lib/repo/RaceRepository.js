module.exports = function(mongoose, model) {
	var Repository = require('./baseRepository');
	var raceRepository = new Repository(mongoose, model, {
        create: function(req, res) {
            return {
                local: {
					email: req.body.email,
                	password: req.body.password
				}
            }
        },
        update: function(req, res) {
            req[model].local.email = req.body.password;
            req[model].local.password = req.body.password;
        }
    });
	
	// optional: Add more repository-methods
	raceRepository.test = function()
	{
		console.log('dota');	
	};
	
    return raceRepository; 
}