module.exports = function(mongoose, modelName) {
	var ParticipantRepository = require('../baseRepository');
	
	// optional: Add more repository-methods
	ParticipantRepository.prototype.test = function()
	{
		console.log('dota');	
	};
	
    return new ParticipantRepository(mongoose, modelName, {
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