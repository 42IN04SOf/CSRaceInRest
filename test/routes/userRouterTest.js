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
		describe('Users retrieval', function() {
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
					})
			});
		});
	}
}