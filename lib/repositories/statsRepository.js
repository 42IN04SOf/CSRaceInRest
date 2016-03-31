module.exports = function(mongoose, model) {
    var repository = require('./baseMongooseRepository');
    
    return new repository(mongoose, model, {
        create: function(req, res) {
            return {
                userid: req.body.userid,
                raceid: req.body.raceid,
                waypointid: req.body.waypointid,
                time: req.body.time
            }
        },
        
        update: function(req, res) {
            req[model].userid = req.body.userid;
            req[model].raceid = req.body.raceid;
            req[model].waypointid = req.body.waypointid;
            req[model].time = req.body.time;
        }
    });
}