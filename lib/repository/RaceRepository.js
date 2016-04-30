module.exports = function(mongoose, modelName) {
	var RaceRepository = require('../baseRepository');
	
	// optional: Add more repository-methods
	RaceRepository.prototype.test = function()
	{
		console.log('dota');	
	};
	
    return new RaceRepository(mongoose, modelName, {
        create: function(req, res) {
            return {
                name: req.body.name,
                ownerID: req.body.userId
            }
        },
        update: function(req, res) {
            req[modelName].name = req.body.name,
            req[modelName].ownerID = req.body.userId,
            req[modelName].dateStart = req.body.dateStart,
            req[modelName].dateStop = req.body.dateStop
        }
    }); 
}