module.exports = function(mongoose, model) {	
	var Repository = require('./baseRepository');
	var userRepository = new Repository(mongoose, model, {
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
	userRepository.test = function()
	{
		console.log('dota');
	};
	
    return userRepository;
}