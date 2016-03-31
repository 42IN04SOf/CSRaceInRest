module.exports = function (mongoose, middleware) {
    
    var schema = new mongoose.Schema({
        name        : { type: String },
        ownerID     : { type: String },
        dateCreate  : { type: Date, default: Date.now },
        dateStart   : { type: Date},
        dateStop    : { type: Date}
    });

    if(middleware) {
        middleware(schema);
    }
    
    mongoose.model('race', schema);
}