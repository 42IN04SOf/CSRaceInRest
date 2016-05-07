var bcrypt  	= require('bcrypt-nodejs');
var jwt 		= require('jwt-simple');
var secret 		= 'B U L L E T B U L L E T B U L L E T';

module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		local : {
			email		: String,
			password    : String,
			token 		: String
		},
		facebook : {
			id          : String,
			token       : String,
			email       : String,
			name        : String
		},
		twitter : {
			id          : String,
			token       : String,
			displayName : String,
			username    : String
		},
		google : {
			id          : String,
			token       : String,
			email       : String,
			name        : String
		},
		dateCreate  : { type: Date, default: Date.now }
	});	
		
	schema.statics.generateHash = function(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};
	
	schema.methods.generateToken = function() {
		this.local.token = jwt.encode(this.toObject(), secret);
	};

	schema.methods.validPassword = function(password) {
		return bcrypt.compareSync(password, this.local.password);
	};
	
	schema.methods.populateOwned = function() {
		// todo
	}
	
	schema.methods.populateParticipating = function() {
		// todo
	}
	
	// removes unnecessary properties and returns a plain JS-object
	schema.methods.asPublic = function() {
		var user = this.toObject();
		delete user["__v"];
		return user;
	}
	
	mongoose.model('User', schema);
}