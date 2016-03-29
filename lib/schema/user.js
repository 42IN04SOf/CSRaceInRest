module.exports = function (mongoose, middleware) {
	
	var schema = new mongoose.Schema({
		name        : { type: String },
		lastname	: { type: String },
		dateCreate  : { type: Date, default: Date.now }
	});

	if(middleware) {
		middleware(schema);
	}
	
	mongoose.model('user', schema);
}