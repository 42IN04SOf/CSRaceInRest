module.exports = function(mongoose, model) {
    var repository = require('./baseMongooseRepository');
    
    return new repository(mongoose, model, {
        create: function(req, res) {
            return {
                raceid: req.body.raceid,
                userid: req.body.userid
            }
        },
        
        update: function(req, res) {
            req[model].raceid = req.body.raceid;
            req[model].userid = req.body.userid;
        }
    });
}