// ==== TESTS HERE ====


module.exports = {
    tests: function(app, agent, expect, should) {
        
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzJjN2M1OTY5NDVhM2Q4MjQyMjVlZTEiLCJsb2NhbCI6eyJwYXNzd29yZCI6IiQyYSQwOCQwVXhDb2lqc0ZhYjU4bC5lU09hcU0uaC55OGl5ZXZwYklvYk5kaVRIWXBrMDI0eTlKNS9RaSIsImVtYWlsIjoiZW1haWwifX0.FAZWgxTWUtshl8_2bBMAbDHGOjDHAANKMK01askFD5U';
        
        describe('Login', function () {
            this.timeout(5000);
            it('should create a new race', function(done) {
                agent.get('/login?token=' + token)
                    .expect(200)
                    .end(function(err, res) {
                        if(err) {
                            return done(err);
                        }
                        done();
                    })
            });
		});
    }
};