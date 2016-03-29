module.exports = function(mongoose, model) {
    var repository = require('./baseMongooseRepository');
    
    return new repository(mongoose, model, {
        
        create: function(req, res) {
            return {
                name: req.body.name,
                lastname: req.body.lastname
            }
        },
        
        update: function(req, res) {
            req[model].name = req.body.name;
            req[model].lastname = req.body.lastname;
        }
    });
}