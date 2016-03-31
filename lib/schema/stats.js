module.exports = function (mongoose, middleware) {
    
    var schema = new mongoose.Schema({
        raceID          : { type: String },
        userID          : { type: String },
        waypointID      : { type: String },
        dateCreate      : { type: Date, default: Date.now }
    });

    if(middleware) {
        middleware(schema);
    }
    
    mongoose.model('stats', schema);
}