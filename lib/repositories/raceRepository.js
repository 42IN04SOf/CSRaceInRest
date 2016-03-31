module.exports = function(mongoose, model) {
    var repository = require('./baseMongooseRepository');
    
    return new repository(mongoose, model, {
        create: function(req, res) {
            return {
                name: req.body.name,
                ownerid: req.body.ownerid
            }
        },
        
        update: function(req, res) {
            req[model].name = req.body.name;
            req[model].ownerid = req.body.ownerid;
        }
    });
}