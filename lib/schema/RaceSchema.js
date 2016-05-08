module.exports = function(mongoose) {
	
	var schema = mongoose.Schema({
		name        : { type: String, required: true },
		ownerID     : { type: String, ref: 'User', required: true },
		dateCreate  : { type: Date, default: Date.now, required: true },
		dateStart   : { type: Date },
		dateStop    : { type: Date }
	});
	
	// retrieve waypoints with current raceId
	/* If not being used yet, makes tests look more effective
	schema.methods.populateWaypoints = function() {
		// todo
	}
	// retrieve participant with current raceId
	schema.methods.populateParticipants = function() {
		// todo
	}
	*/
	
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
		var self = this;
		if(this.dateStart){ // check if not already started
			var err = new Error('race.alreadyStarted');
			err.status = 400;
			throw err;
		}
		
		var WaypointSchema = mongoose.model('Waypoint');
		WaypointSchema.count({ raceID: self._id }, function(err, count) {
			if(err) { throw err; }
			if(count <= 0) { // check for waypoints
				var err = new Error('race.noWaypoints');
				err.status = 400;
				throw err;
			}
			self.dateStart = Date.now();
			self.save(function(err) {
				if(err) { throw err; }
			});
		});
	}

	// Stops the race.
	schema.methods.stop = function() {
		if(!this.dateStart){
			var err = new Error('race.notStarted');
			err.status = 400;
			throw err;
		}
		if(this.dateStop){
			var err = new Error('race.alreadyStopped');
			err.status = 400;
			throw err;
		}
		this.dateStop = Date.now();
		this.save(function(err) {
			if(err) { throw err; }
		});
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
		return this.ownerID._id.equals(user._id);
	}
	
	// Returns true is the given user is authorized.
	schema.methods.authorize = function(user) {
		return ;
	}
	
	mongoose.model('Race', schema);
}