// ==== TESTS HERE ====

// test for API
// - retrieving user
// - creating a user (not implemented, generate token when created)
// - updating a user
// - deleting a user

// - get participating races
// - get owned races

// to emulate a user, use: token={mytoken}
// login and register are disabled during test.

module.exports = {
	tests: function(app, agent, expect, should) {
		describe('User router', function() {
			this.timeout(5000);
			it('should get a list of all users', function(done) {
				agent.get('/user?format=json')
					.expect(200)
					.expect('Content-Type', /json/)
					.end(function(err, res) {
						if (err) { return done(err); }
						if(!res.body) {
							return done(new Error('Body is empty, not even an empty array.'));
						}
						done();
					});
			});
		});
		
		describe('User management', function () {
			var d = new Date();
			var ms = d.getTime();
			var email = ms + "@e.mail";
			
			//Should work when views are complete!
			it('should should create a new user', function (done) {
				agent.post('/signup')
					.send({ "email": email, "password": "test" })
					.expect(302)
					.expect('location', '/profile')
					.end(function (err, res) {
						if (err) {
							done(err);
						} else {
							done();
						}
					});
			});
			
			//Should work when views are complete!
			it('should login', function (done) {
				agent.post('/login')
					.send({ "email": email, "password": "test" })
					.expect(302)
					.expect('location', '/profile')
					.end(function (err, res) {
						if (err) {
							done(err);
						} else {
							done();
						}
					});
			});
		});
		
		describe('Getting races', function () {
			var userID = "572c7c596945a3d824225ee1";
				
			it('should get a list of all races the user is participating in', function (done) {
				agent.get('/user/' + userID + '/participatingraces?format=json')
					.expect(200)
					.end(function (err, res) {
						if (err) {
							done(err);
						} else {
							done();
						}
					});
			});
			
			it('should get a list of all races the user is participating in', function (done) {
				agent.get('/user/' + userID + '/owningraces?format=json')
					.expect(200)
					.end(function (err, res) {
						if (err) {
							done(err);
						} else {
							done();
						}
					});
			});
		});
	}
	
}