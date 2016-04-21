module.exports = function (mongoose, middleware) {
	
	var schema = new mongoose.Schema({
		name        : { type: String },
		password    : { type: String,  },
		dateCreate  : { type: Date, default: Date.now }
	});

	if(middleware) {
		middleware(schema);
	}
	
	// Static methods
	schema.statics.getAll = function(cb) {
		return this.find(cb);
	};
	
	// Instance methods
	schema.methods.getWithSameName = function(cb) {
		return this.model('user').find({ name: this.name }, cb);
	}
	
	schema.methods.toJson = function(cb) {
		return cb({
			name: this.name,
			desc: this.desc
		});
	}
	
	// Virtual methods
	schema.virtual('secret') = function(cb) {
		return `name: ${this.name} & pass: ${this.password}`;
	};
	
	mongoose.model('user', schema);
	
	var model = mongoose.model('user');
	model.getAll();
	
	
	var user = new model();
	user.getFullName()
	user.fullname
}