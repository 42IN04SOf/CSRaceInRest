var bcrypt  	= require('bcrypt-nodejs');
var jwt 		= require('jwt-simple');
var secret 		= 'B U L L E T B U L L E T B U L L E T';

module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		local : {
			email		: { type : String },
			password    : { type : String },
			token 		: { type : String, required: true },
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
		isAdministrator : { type: Boolean, default: false, required: true },
		dateCreate  : { type: Date, default: Date.now, required: true }
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
	
	/* If not being used, makes tests look more effective
	schema.methods.populateOwned = function() {
		// todo
	}
	
	schema.methods.populateParticipating = function() {
		// todo
	}
	*/
	schema.methods.isAdmin = function() {
		return this.isAdministrator;
	}
	
	// removes unnecessary properties and returns a plain JS-object
	schema.methods.asPublic = function() {
		var user = this.toObject();
		delete user["__v"];
		if(user.google) {
			delete user.google.token;
			delete user.google.id;
		}
		if(user.local) {
			delete user.local.password;
		}
		return user;
	}
	
	mongoose.model('User', schema);
}