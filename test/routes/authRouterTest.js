// ==== TESTS HERE ====


module.exports = {
    tests: function(app, agent, expect, should) {
        
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzJjN2M1OTY5NDVhM2Q4MjQyMjVlZTEiLCJsb2NhbCI6eyJwYXNzd29yZCI6IiQyYSQwOCQwVXhDb2lqc0ZhYjU4bC5lU09hcU0uaC55OGl5ZXZwYklvYk5kaVRIWXBrMDI0eTlKNS9RaSIsImVtYWlsIjoiZW1haWwifX0.FAZWgxTWUtshl8_2bBMAbDHGOjDHAANKMK01askFD5U';
        
        describe('Authentication', function () {
            this.timeout(5000);
            it('should login', function(done) {
                agent.get('/login?token=' + token)
                    .expect(302)
                    .end(function(err, res) {
                        if(err) {
                            return done(err);
                        }
                        done();
                    })
            });
            
            var raceID;
             
            it('should get a list of all races', function(done) {
                agent.get('/race?format=json')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        if(!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        raceID = res.body.result[0]._id;
                        done();
                    })
            });
            
            it('should logout', function(done) {
                agent.get('/logout')
                    .expect(302)
                    .end(function(err, res) {
                        if(err) {
                            return done(err);
                        }
                        done();
                    })
            });
            
            it('shouldnt delete the race', function(done) {
                agent.delete('/race/' + raceID + '?token=faketoken')
                    .expect(401)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        if(!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        done();
                    })
            });
            
            it('shouldnt create a new race', function(done) {
                agent.post('/race?format=json&token=faketoken')
                    .send({ "name": "naamtest"})
                    .expect(401)
                    .end(function(err, res) {
                        if(err) {
                            return done(err);
                        }
                        done();
                    })
            });
            
            it('shouldnt add a waypoint to the race', function(done) {
                var placeID = 'ChIJPVoIuvXuxkcR9TGwHoTMgrY';
                agent.post('/race/' + raceID + '/waypoints?token=faketoken')
                    .send({"pid": placeID, "comment": "some comment"})
                    .expect(401)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        if(!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        done();
                    })
            });

            it('shouldnt join the race', function (done) {
                agent.post('/race/' + raceID + '/participants?format=json&token=faketoken')
                    .expect(401)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        if (!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        participantID = res.body._id;
                        done();
                    })
            });
            
            it('shouldnt start the race', function(done) {
                agent.post('/race/' + raceID + '/state?token=faketoken')
                    .expect(401)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        if(!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        done();
                    })
            });
            
            it('shouldnt complete a waypoint', function(done) {
                agent.put('/race/' + raceID + '/participants/fakeuserid/waypoints?format=json&token=faketoken')
                    .send({ "wid": "fakeid" })
                    .expect(401)
                    .end(function(err, res) {
                        if (err) { return done(err); }
                        if(!res.body) {
                            return done(new Error('Body is empty, not even an empty array.'));
                        }
                        done();
                    })
            });
            
            it('should stop the race', function(done) {
                agent.delete('/race/' + raceID + '/state?token=faketoken')
                    .expect(401)
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
};