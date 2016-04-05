var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var express = require('express');
var app = express();
//var port     = process.env.PORT || 9090;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('../config/testdatabase.js');

mongoose.connect(configDB.url); // connect to our database

require('../config/passport')(passport);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.listen(9090)

require('../app/routes.js')(app, passport);
//app.use('/', routes);

var agent = request.agent('http://localhost:9090');

/*agent
  .post('/login')
  .send({ email: 'test@test.ts', password: 'test' })
  .end(function(err, res) {
    // user1 will manage its own cookies
    // res.redirects contains an Array of redirects
  });*/

function makeRequest(route, statusCode, done) {
    request(app)
        .get(route)
        .expect(statusCode)
        .end(function(err, res) {
            if (err) { return done(err); }

            done(null, res);
        });
};

function loginUser() {
    agent
        .post('/login')
        .send({ email: 'test@test.ts', password: 'test' })
        .end(function(err, res) {
            // user1 will manage its own cookies
            // res.redirects contains an Array of redirects
        });

    /*return function(done) {
        agent
            .post('/login')
            .send({ email: 'test@test.ts', password: 'test' })
            .expect(302)
            .expect('Location', '/profile')
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };*/
};

describe('Testing authentication', function() {
    it('should create an account', function(done) {
        agent.post('/signup')
            .send({ "email": "test@test.ts", "password": "test" })
            .expect(302)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should login', function(done) {
        agent
            .post('/login')
            .send({ email: 'test@test.ts', password: 'test' })
            .expect(302)
            .expect('Location', '/profile')
            .end(onResponse);

        function onResponse(err, res) {
            if (err) {
                done(err);
            } else {
                done();
            }
        }
    })
})

describe('Testing race', function() {
    var raceID;
    var userID;

    it('should create a new race, and return it', function(done) {
        agent.post('/api/race/')
            .send({ "name": "naamtest", "ownerID": "ownerIDtest" })
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    res.body.should.have.property('name', 'naamtest');
                    res.body.should.have.property('ownerID', 'ownerIDtest');
                    //raceID = res.body._id;
                    done();
                }
            })
    });

    it('should create a new race', function(done) {
        it('should login', loginUser());
        agent.post('/race')
            .send({ "name": "naamtest2" })
            .expect(302)
            .expect('Content-Type', "text/plain; charset=utf-8")
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    done();
                }
            })
    });

    it('should return a race list', function(done) {
        agent.get('/api/race/')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    done();
                }
            })
    });

    it('should return a list of my races', function(done) {
        it('should login', loginUser());
        agent.get('/race/my')
            .expect(202)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    raceID = res.body[0]._id;
                    userID = res.body[0].ownerID;
                    done();
                }
            })
    });

    it('should read a specific race', function(done) {
        it('should login', loginUser());
        var url = "/api/race/" + raceID;
        agent.get(url)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    res.body.should.have.property('name', 'naamtest2');
                    res.body.should.have.property('ownerID', userID);
                    done();
                }
            })
    });

    it('should join a race', function(done) {
        it('should login', loginUser());
        var url = "/race/" + raceID + '/join';
        agent.post(url)
            .expect(302)
            .expect('Location', '/race/' + raceID + '/deelnemer')
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    done();
                }
            })
    });

    it('should update a race', function(done) {
        it('should login', loginUser());
        var url = "/api/race/" + raceID;
        agent.patch(url)
            .send({ "name": "nieuwenaam" })
            .expect(202)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    res.body.should.have.property('name', 'nieuwenaam');
                    res.body.should.have.property('ownerID', userID);
                    done();
                }
            })
    })
    
    it('should open the addplaces page', function(done) {
        //race/:id/addplace/add/:gid
        it('should login', loginUser());
        var url = '/race/' + raceID + '/addplaces/';
        agent.post(url)
            .send({ "lon": "51.695772", "lat": "5.304788", "rad": "2000", "query": "cafe" })
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should add a waypoint to a race', function(done) {
        //race/:id/addplace/add/:gid
        it('should login', loginUser());
        var url = '/race/' + raceID + '/addplace/add/ChIJz7lU6reqoUcRtKnmGYl3whs';
        agent.post(url)
            .expect(302)
            .expect('Location', '/race/' + raceID + '/edit')
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should open the race edit page', function(done) {
        it('should login', loginUser());
        var url = '/race/' + raceID + '/edit';
        agent.get(url)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should open the race details page', function(done) {
        it('should login', loginUser());
        var url = '/race/' + raceID;
        agent.get(url)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should open the race deelnemer page', function(done) {
        it('should login', loginUser());
        var url = '/race/' + raceID + '/deelnemer';
        agent.get(url)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should open the profile page', function(done) {
        it('should login', loginUser());
        var url = "/profile";
        agent.get(url)
            .expect(200)
            .expect('Content-Type', "text/html; charset=utf-8")
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should open the race page', function(done) {
        it('should login', loginUser());
        var url = "/race";
        agent.get(url)
            .expect(200)
            .expect('Content-Type', "text/html; charset=utf-8")
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })
    
    it('should start the race', function(done) {
        it('should login', loginUser());
        var url = "/race/" + raceID + "/start";

        agent.post(url)
            .expect(302)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })
    
    it('should stop the race', function(done) {
        it('should login', loginUser());
        var url = "/race/" + raceID + "/stop";

        agent.post(url)
            .expect(302)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })
    
    // this test should always be ran last within this block, before logout.
    it('should delete the race', function(done) {
        it('should login', loginUser());
        var url = "/api/race/" + raceID;
        agent.delete(url)
            .expect(202)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    describe('Testing logout', function() {
        it('should log out', function(done) {
            agent.get("/logout")
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                })
        })
    })
});

describe('Testing pages while logged out', function() {
    it('should log out', function(done) {
        agent.get("/logout")
            .expect(302)
            .expect('Location', '/')
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should create a new race, and return it', function(done) {
        agent.post('/api/race/')
            .send({ "name": "naamtest", "ownerID": "ownerIDtest" })
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    res.body.should.have.property('name', 'naamtest');
                    res.body.should.have.property('ownerID', 'ownerIDtest');
                    done();
                }
            })
    });

    var raceID;

    it('should return a race list', function(done) {
        agent.get('/api/race/')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    raceID = res.body[0]._id;
                    done();
                }
            })
    });

    it('should not join a race', function(done) {
        var url = "/race/" + raceID + '/join';
        agent.post(url)
            .expect(302)
            .expect('Location', '/')
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    done();
                }
            })
    });

    /*it('should update a race', function(done) {
        var url = "/api/race/" + raceID;
        agent.patch(url)
            .send({ "name": "nieuwenaam" })
            .expect(202)
            .expect('Location', '/')
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    res.body.should.have.property('name', 'nieuwenaam');
                    done();
                }
            })
    })*/

    it('should not add a waypoint to a race', function(done) {
        //race/:id/addplace/add/:gid
        var url = '/race/' + raceID + '/addplace/add/ChIJz7lU6reqoUcRtKnmGYl3whs';
        agent.post(url)
            .expect(302)
            .expect('Location', '/')
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should not open the race edit page', function(done) {
        var url = '/race/' + raceID + '/edit';
        agent.get(url)
            .expect(302)
            .expect('Location', '/')
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

    it('should not open the race deelnemer page', function(done) {
        var url = '/race/' + raceID + '/deelnemer';
        agent.get(url)
            .expect(302)
            .expect('Location', '/')
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
    })

});



