module.exports = function(mongoose, model) {
    var repository = require('./baseMongooseRepository');
    
    return new repository(mongoose, model, {
        
        create: function(req, res) {
            return {
                username: req.body.name,
                name: req.body.name,
                lastname: req.body.lastname
            }
        },
        
        update: function(req, res) {
            req[model].username = req.body.username;
            req[model].name = req.body.name;
            req[model].lastname = req.body.lastname;
        }
    });
}