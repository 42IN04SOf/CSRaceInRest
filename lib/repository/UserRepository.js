module.exports = function(mongoose, modelName) {
	var UserRepository = require('../baseRepository');
	
	// optional: Add more repository-methods
	UserRepository.prototype.test = function()
	{
		console.log('dota');	
	};
	
    return new UserRepository(mongoose, modelName, {
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