module.exports = function(mongoose, model) {
    var repository = require('./baseMongooseRepository');
    return new repository(mongoose, model, {
        create: function(req, res) {
            return {
                name: req.body.name,
                raceid: req.body.raceid,
                coordinates: req.body.coordinates
            }
        },
        update: function(req, res) {
            req[model].name = req.body.name;
            req[model].raceid = req.body.raceid;
            req[model].coordinates = req.body.coordinates;
        }
    });
}