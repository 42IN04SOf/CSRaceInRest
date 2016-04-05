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


console.log(app.use);

require('../app/routes.js')(app, passport);
//app.use('/', routes);


function makeRequest(route, statusCode, done) {
    request(app)
        .get(route)
        .expect(statusCode)
        .end(function(err, res) {
            if (err) { return done(err); }

            done(null, res);
        });
};

describe('Testing authentication', function() {
    it('should create an account', function(done) {
        request(app).post('/signup')
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
        request(app).post('/login')
            .send({ "email": "test@test.ts", "password": "test" })
            .expect(302)
            .end(function(err, res) {
                if (err) {
                    done(err);
                } else {
                    done();

                    //res.body.should.have.property('name', 'testname');
                    //res.body.should.have.property('ownerID', 'TestOwnerID'); 
                }
            })
    })
})

describe('Testing race route', function() {
    describe('Testing race', function() {
        it('should create a new race, and return it', function(done) {
            request(app).post('/api/race/')
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


        var resultID;

        it('should return a race list', function(done) {
            request(app).get('/api/race/')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        resultID = res.body[0]._id;
                        done();
                    }
                })
        });

        it('should read a specific race', function(done) {
            var url = "/api/race/" + resultID;
            request(app).get(url)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                })
        });

        it('should join a race', function(done) {
            var url = "/race/join/" + resultID;
            console.log(url);
            request(app).post(url)
                .expect(302)
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
            var url = "/api/race/" + resultID;
            request(app).patch(url)
                .send({ "name": "nieuwenaam" })
                .expect(202)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        res.body.should.have.property('name', 'nieuwenaam');
                        done();
                    }
                })
        })

        // this test should always be ran last within this block.
        it('should delete the found race', function(done) {
            var url = "/api/race/" + resultID;
            request(app).delete(url)
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
    });

    describe('Testing pages', function() {
        it('should open the profile page', function(done) {
            var url = "/profile";
            request(app).get(url)
                .expect(302)
                .expect('Content-Type', "text/plain; charset=utf-8")
                .end(function(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                })
        })

        it('should open the race page', function(done) {
            var url = "/race";
            request(app).get(url)
                .expect(302)
                .expect('Content-Type', "text/plain; charset=utf-8")
                .end(function(err, res) {
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                })
        })
    })

    describe('Testing logout', function() {
        it('should log out', function(done) {
            request(app).get("/logout")
                .expect(302)
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

