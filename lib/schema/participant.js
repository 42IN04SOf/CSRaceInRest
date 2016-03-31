module.exports = function (mongoose, middleware) {
	
	var schema = new mongoose.Schema({
        userID        : { type: String },
		raceID        : { type: String },
	});

	if(middleware) {
		middleware(schema);
    }
    
	mongoose.model('participant', schema);
}