// ==== TESTS HERE ====

// test for API
// - retrieving races
// - creating a race
// - updating a race
// - deleting a race

// - start a race
// - stop a race

// - get participants from race
// - add participants to race
// - remove participants from race (route not implemented)
// - participant completes waypoint during race

// - get all waypoints from a race
// - create new waypoint for a race
// - remove all waypoints from a race (route not implemented)

// to emulate a user, use: token={mytoken}
// no login or register here

module.exports = {
    tests: function(app, agent, expect, should) {
        
        describe('Races retrieval', function() {
            it('should get a list of all races', function(done) {
                agent.get('/race?format=json')
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
        
		// more tests here
    }
};