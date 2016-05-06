module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		name        : { type: String },
		ownerID     : { type: String, ref: 'User' },
		dateCreate  : { type: Date, default: Date.now },
		dateStart   : { type: Date},
		dateStop    : { type: Date}
	});
	
	// retrieve waypoints with current raceId
	schema.methods.populateWaypoints = function() {
		// todo
	}
	// retrieve participant with current raceId
	schema.methods.populateParticipants = function() {
		// todo
	}
	
	schema.methods.popOwner = function(next) {
		this.populate('ownerID', function(err, race) {
			if(err) {
				next(err);
			}
			next(null, race);
		});
	};
	
	// ===================================================
	// LOGIC =============================================
	// ===================================================
	// Starts the race.
	schema.methods.start = function() {
		if(this.dateStart)
			throw new Error('race.alreadyStarted');
		this.dateStart = Date.now();
		this.save(function(err) {
            if(err) { throw err; }
        });
	}

	// Stops the race.
	schema.methods.stop = function() {
		if(!this.dateStart)
			throw new Error('race.notStarted');
		if(this.dateStop)
			throw new Error('race.alreadyStopped');
		this.dateStop = Date.now();
		this.save();
	}
	// Resets the race
	schema.methods.reset = function() {
		this.dateStart = undefined;
		this.dateStop = undefined;
		this.save(function(err) {
            if(err) { throw err; }
        });
	}
	
	// ===================================================
	// VIEWABLE ==========================================
	// ===================================================
	schema.methods.resetStartStop = function() {
		var self = this;
		delete self.dateStart;
		delete self.dateStop;
		this.save();
	}
	
	schema.methods.getParticipants = function() {
		this.populate()
	}
	
	schema.statics.getRacesAsOwner = function (userId, callback) {
		this.model('Race').find({ ownerID: userId }).exec(function (err, item) {
			if (err) {
				console.log(err);
			} else {
				callback(err, item);
			}
		});
	}
	
	schema.methods.addParticipant = function(userId, callback) {
		if(this.dateStart || this.dateStop) {
			var Participant = his.model('Participant');
			var newParticipant = new Participant({
				raceID: this._id,
				userID: userId,
			});
			newParticipant.save(function(err) {
				if(err) { return callback(err); }
				callback(null, newParticipant);
			});
		}
		else {
			var cannotParticipateError = new Error('race.cannotParticipate');
			cannotParticipateError.status = 400;
			callback(cannotParticipateError);
		}
	};
	
	// removes unnecessary properties and returns a plain JS-object
	schema.methods.asPublic = function() {
		var race = this.toObject();
		delete race["__v"];
		return race;
	}
	
	// ===================================================
	// AUTHORIZATION =====================================
	// ===================================================
	// Returns true is the given user is the owner.
	schema.methods.isOwner = function(user) { 
		return this.ownerID === user._id;
	}
	
	// Returns true is the given user is authorized.
	schema.methods.authorize = function(user) {
		return ;
	}
	
	mongoose.model('Race', schema);
}