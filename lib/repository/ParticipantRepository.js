module.exports = function(mongoose, modelName) {
	var ParticipantRepository = require('../baseRepository')(mongoose, modelName, {
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
	ParticipantRepository.test = function()
	{
		console.log('particpant');	
	};
	
    return ParticipantRepository; 
}