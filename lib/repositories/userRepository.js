module.exports = function(mongoose, model) {
    var repository = require('./baseMongooseRepository');
    
    return new repository(mongoose, model, {
        
        create: function(req, res) {
            return {
                email: req.body.email,
                password: req.body.password
            }
        },
        
        update: function(req, res) {
            req[model].email = req.body.email;
            req[model].password = req.body.password;
        }
    });
}