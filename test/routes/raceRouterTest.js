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
        
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzJjN2M1OTY5NDVhM2Q4MjQyMjVlZTEiLCJsb2NhbCI6eyJwYXNzd29yZCI6IiQyYSQwOCQwVXhDb2lqc0ZhYjU4bC5lU09hcU0uaC55OGl5ZXZwYklvYk5kaVRIWXBrMDI0eTlKNS9RaSIsImVtYWlsIjoiZW1haWwifX0.FAZWgxTWUtshl8_2bBMAbDHGOjDHAANKMK01askFD5U';
        var ownerID;
        var raceID;
        
        describe('Races router', function () {
            this.timeout(5000);
            it('should create a new race', function(done) {
                agent.post('/race?token=' + token)
                    .send({ "name": "naamtest"})
                    .expect(201)
                    .end(function(err, res) {
                        if(err) {
                            return done(err);
                        }
                        done();
                    })
            });
            
            it('should get a list of all races', function(done) {
                agent.get('/race?format=json')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        if(!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        console.log(res.body.result[0]);
                        ownerID = res.body.result[0].ownerID._id;
                        raceID = res.body.result[0]._id;
                        done();
                    })
            });
            
            it('should find one race from the list', function(done) {
                agent.get('/race/' + raceID + '?format=json')
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
            
            /* Deze zooi heeft gewerkt, maar wil dat nu ineens niet meer...*/
            it('should add a waypoint to the race', function(done) {
                var placeID = 'ChIJPVoIuvXuxkcR9TGwHoTMgrY';
                agent.post('/race/' + raceID + '/waypoints?token='+token)
                    .send({"pid": placeID, "comment": "some comment"})
                    .expect(201)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        if(!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        done();
                    })
            });
            
            it('should get a list of all waypoints from a race', function(done) {
                agent.get('/race/' + raceID + '/waypoints?format=json&token='+token)
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
            
            /*it('should join the race', function(done) {
                agent.post('/race/' + raceID + '/participants?token='+token)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        if(!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        done();
                    })
            })*/
        });
        
		// more tests here
    }
};