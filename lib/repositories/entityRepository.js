module.exports = function(mongoose, model) {
    var repository = require('./baseMongooseRepository');
    return new repository(mongoose, model, {
        create: function(req, res) {
            return {
                name: req.body.name,
                desc: req.body.desc
            }
        },
        update: function(req, res) {
            req[model].name = req.body.name;
            req[model].desc = req.body.desc;
        }
    });
}