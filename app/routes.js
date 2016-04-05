var mongoose = require('mongoose');
var http = require('http');
var request = require('request');
var JSON = require('JSON');
var ws = require('nodejs-websocket');

// local vars
var API = "AIzaSyBnOX9RDvO8Te8BftCqZBTeA5-bGPuQYb4";

// require models
var Race = require('./models/race.js');
var RaceDeelnemer = require('./models/racedeelnemer.js');
var Waypoint = require('./models/waypoint.js');
var User = require('./models/user.js');
var server;

module.exports = function(app, passport) {
    
    server = ws.createServer(function(conn) {
        console.log('New socket connection');
        conn.send("Nog geen berichten");
        conn.on("text", function(str) {
            console.log(str);
            conn.sendText(str);
        })
        conn.on("close", function (code, reason) {
		console.log("Connection closed");
	    })
    }).listen(9091)
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/connect/google/callback', passport.authorize('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));
    
    // =====================================
    // WEBSOCKET ===========================
    // =====================================

    // =====================================
    // API ONLY ============================
    // =====================================
    
    // Gets one race, id = race id.
    app.get('/api/race/:id', function(req, res) {
        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if(err) {
                res.send('error occured while getting race');
            } else {
                res.json(_race);
            }
        })
    })
    
    app.get('/api/race/', function(req, res) {
        Race.find().exec(function(err, _race) {
            if(err) {
                res.send('error occured while getting races');
            } else {
                res.json(_race);
            }
        })
    })
    
    app.post('/api/race/', function(req, res) {
        var race = new Race();
        
        if(!req.body)
        {
            res.send('One or both values were not entered');
            console.log('One or both values were not entered');
        }
        else {
            race.name = req.body.name;
            race.ownerID = req.body.ownerID;

            race.save(function(err, race) {
                if (err) {
                    res.send('something went wrong creating race');
                } else {
                    res.status(201);
                    res.json(race);
                }
            })
        }
    })
    
    app.patch('/api/race/:id', function(req, res) {
        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if(req.body.name) {
                _race.name = req.body.name;
            }
            if(req.body.ownerID) {
                _race.ownerID = req.body.ownerID;
            }
            
            _race.save(function(err) {
                if(err) {
                    res.send('something when wrong updating race');
                }
                else {
                    res.status(202);
                    res.json(_race);
                }
            })
        })
    })
    
    app.delete('/api/race/:id', function(req, res) {
        Race.remove({ _id: req.params.id }).exec(function(err) {
            if(err) {
                res.send('something went wrong deleting race');
            } else {
                res.status(202);
                res.json({"message": "race deleted"});
            }
        })
    })

    // the races list page
    app.get('/race', isLoggedIn, function(req, res) {

        var myRaces;
        var deelnemend;
        var races;

        Race.find({ ownerID: req.user._id }).exec(function(err, _myRaces) {
            if (err) {
                res.send('error has occured');
            } else {
                myRaces = _myRaces;

                Race.find({}).exec(function(err, _allRaces) {
                    if (err) {
                        res.send('error has occured');
                    } else {
                        races = _allRaces;

                        RaceDeelnemer.find({ userID: req.user._id }).exec(function(err, _deelnemend) {
                            if (err) {
                                res.send('error has occured');
                            } else {
                                var ids = [];

                                for (i = 0; i < _deelnemend.length; i++) {
                                    ids.push(_deelnemend[i].raceID);
                                }

                                Race.find({ _id: { $in: ids } }).exec(function(err, _deelnemendRace) {
                                    if (err) {
                                        res.send('error has occured');
                                    } else {
                                        deelnemend = _deelnemendRace;
                                        
                                        res.render('race.ejs', {
                                            user: req.user, // get the user out of session and pass to template
                                            myraces: myRaces,
                                            deelnemendraces: deelnemend,
                                            races: races
                                        });
                                    }
                                })
                            }
                        });

                    }
                })
            }
        })
    });

    app.get('/race/details/:id', isLoggedIn, function(req, res) {
        var race;
        var deelnemers;

        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if (err) {
                res.send('error has occured while finding race');
            } else {
                race = _race;

                RaceDeelnemer.find({ raceID: race._id }).exec(function(err, _deelnemend) {
                    if (err) {
                        res.send('error has occured while finding deelnemers');
                    }
                    else {

                        var ids = [];

                        for (i = 0; i < _deelnemend.length; i++) {
                            ids.push(_deelnemend[i].userID);
                        }

                        User.find({ _id: { $in: ids } }).exec(function(err, _users) {
                            if (err) {
                                res.send('erros has occured while finding users');
                            }
                            else {
                                for (i = 0; i < _users.length; i++) {
                                    for (x = 0; x < _deelnemend.length; x++) {
                                        if (_users[i]._id == _deelnemend[x].userID) {
                                            _users[i].waypointsCompleted = _deelnemend[x].waypointsCompleted;
                                            
                                            var latestCompleteDate;
                                            
                                            for(y = 0; y < _deelnemend[x].waypointsCompleted.length; y++) {
                                                console.log(_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate);
                                                
                                                if(_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate > latestCompleteDate || y == 0)
                                                {
                                                    console.log(_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate);
                                                    _users[i].latestCompleteDate = _deelnemend[x].waypointsCompleted[y].waypoint.dateCreate;
                                                }
                                            }
                                        }
                                    }
                                }

                                res.render('racedetails.ejs', {
                                    race: race,
                                    user: req.user,
                                    deelnemers: _users
                                });
                            }
                        })
                    }
                })
            }
        })
    })

    app.post('/race/:id/start', isLoggedIn, function(req, res) {
        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if (err) {
                res.send('error has occured finding race');
            } else {
                if (req.user._id == _race.ownerID) {
                    _race.dateStart = new Date();

                    _race.save(function(err) {
                        if (err) {
                            res.send('error has occured while starting race');
                        }
                        else {
                            res.redirect('/race/edit/' + req.params.id);
                        }
                    })
                }
                else {
                    res.send('You are not the owner of this race, and therefore you cannot start it.');
                }
            }
        })
    })

    app.post('/race/:id/stop', isLoggedIn, function(req, res) {
        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if (err) {
                res.send('error has occured finding race');
            } else {
                if (req.user._id == _race.ownerID) {
                    _race.dateStop = new Date();

                    console.log(_race.dateStart);

                    _race.save(function(err) {
                        if (err) {
                            res.send('error has occured while starting race');
                        }
                        else {
                            res.redirect('/race/edit/' + req.params.id);
                        }
                    })
                }
                else {
                    res.send('You are not the owner of this race, and therefore you cannot start it.');
                }
            }
        })
    })

    app.get('/race/deelnemer/:id', isLoggedIn, function(req, res) {
        var race;
        var deelnemers;

        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if (err) {
                res.send('error has occured while finding race');
            } else {
                race = _race;

                RaceDeelnemer.find({ raceID: race._id }).exec(function(err, _deelnemend) {
                    if (err) {
                        res.send('error has occured while finding deelnemers');
                    }
                    else {

                        var ids = [];
                        var myDeelnemer;

                        for (i = 0; i < _deelnemend.length; i++) {
                            ids.push(_deelnemend[i].userID);
                            if (_deelnemend[i].userID == req.user._id) {
                                myDeelnemer = _deelnemend[i];
                            }
                        }

                        User.find({ _id: { $in: ids } }).exec(function(err, _users) {
                            if (err) {
                                res.send('erros has occured while finding users');
                            }
                            else {
                                for (i = 0; i < _users.length; i++) {
                                    for (x = 0; x < _deelnemend.length; x++) {
                                        if (_users[i]._id == _deelnemend[x].userID) {
                                            _users[i].waypointsCompleted = _deelnemend[x].waypointsCompleted;
                                            
                                            var latestCompleteDate;
                                            
                                            for(y = 0; y < _deelnemend[x].waypointsCompleted.length; y++) {
                                                console.log(_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate);
                                                
                                                if(_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate > latestCompleteDate || y == 0)
                                                {
                                                    console.log(_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate);
                                                    _users[i].latestCompleteDate = _deelnemend[x].waypointsCompleted[y].waypoint.dateCreate;
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                deelnemers = _users;

                                Waypoint.find({ raceid: req.params.id }).exec(function(err, _waypoints) {
                                    if (err) {
                                        res.send('error has occured finding waypoints');
                                    }
                                    else {
                                        var uncompletedWaypoints = [];
                                        var completedWaypoints = [];

                                        for (i = 0; i < _waypoints.length; i++) {
                                            var isCompleted = false;
                                            for (x = 0; x < myDeelnemer.waypointsCompleted.length; x++) {
                                                if (_waypoints[i]._id == myDeelnemer.waypointsCompleted[x].waypoint.waypointID) {
                                                    newWaypoint = _waypoints[i];
                                                    newWaypoint.dateCompleted = myDeelnemer.waypointsCompleted[x].waypoint.dateCreate;
                                                    completedWaypoints.push(newWaypoint);
                                                    isCompleted = true;
                                                }
                                            }
                                            if (!isCompleted) {
                                                uncompletedWaypoints.push(_waypoints[i]);
                                            }
                                        }

                                        res.render('racedeelnemer.ejs', {
                                            race: race,
                                            user: req.user,
                                            deelnemers: deelnemers,
                                            waypoints: _waypoints,
                                            compWaypoints: completedWaypoints,
                                            uncompWaypoints: uncompletedWaypoints,
                                            deelnemer: myDeelnemer
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })

    app.get('/race/edit/:id', isLoggedIn, function(req, res) {
        var race;

        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if (err) {
                res.send('error has occured finding race');
            } else {
                race = _race;

                if (req.user._id == race.ownerID) {
                    Waypoint.find({ raceid: req.params.id }).exec(function(err, _waypoints) {
                        if (err) {
                            res.send('error has occured finding waypoints');
                        }
                        else {
                            waypoints = _waypoints;

                            RaceDeelnemer.find({ raceID: race._id }).exec(function(err, _deelnemend) {
                                if (err) {
                                    res.send('error has occured while finding deelnemers');
                                }
                                else {

                                    var ids = [];

                                    for (i = 0; i < _deelnemend.length; i++) {
                                        ids.push(_deelnemend[i].userID);
                                    }

                                    User.find({ _id: { $in: ids } }).exec(function(err, _users) {
                                        if (err) {
                                            res.send('erros has occured while finding users');
                                        }
                                        else {
                                            for (i = 0; i < _users.length; i++) {
                                                for (x = 0; x < _deelnemend.length; x++) {
                                                    if (_users[i]._id == _deelnemend[x].userID) {
                                                        _users[i].waypointsCompleted = _deelnemend[x].waypointsCompleted;

                                                        var latestCompleteDate;

                                                        for (y = 0; y < _deelnemend[x].waypointsCompleted.length; y++) {
                                                            console.log(_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate);

                                                            if (_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate > latestCompleteDate || y == 0) {
                                                                console.log(_deelnemend[x].waypointsCompleted[y].waypoint.dateCreate);
                                                                _users[i].latestCompleteDate = _deelnemend[x].waypointsCompleted[y].waypoint.dateCreate;
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            deelnemers = _users;

                                            res.render('raceedit.ejs', {
                                                race: race,
                                                user: req.user,
                                                deelnemers: deelnemers,
                                                waypoints: waypoints
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
                else {
                    res.send('You are not the owner of this race, and therefore you cannot edit it.')
                }
            }
        })
    })

    app.post('/race/:id/addplaces/', isLoggedIn, function(req, res) {

        var id = req.params.id;
        var lon = req.body.lon;
        var lat = req.body.lat;
        var rad = req.body.rad;
        var query = req.body.query;
        var race;

        if (id != null && lon != null && lat != null && rad != null && query != null) {
            var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=';
            url += API;
            url += '&location=';
            url += lon + ',' + lat;
            url += '&radius=' + rad;
            url += '&type=' + query;
        }

        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if (err) {
                res.send('error has occured finding race');
            } else {
                race = _race;

                request(url, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var json = JSON.parse(body);

                        //console.log(json.results[0]) // Show the HTML for the Google homepage.

                        res.render('addplaces.ejs', {
                            user: req.user,
                            raceID: id,
                            race: race,
                            places: json.results
                        });
                    }
                })
            }
        })
        //'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBnOX9RDvO8Te8BftCqZBTeA5-bGPuQYb4&location=51.698963,5.302557&radius=2000&type=cafe'
    })

    app.post('/race/:id/addplace/add/:gid', isLoggedIn, function(req, res) {
        var newWaypoint = new Waypoint();

        var redirectUrl = '/race/edit/' + req.params.id;

        var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.params.gid + '&key=' + API;
        
        Race.findOne({ _id: req.params.id }).exec(function(err, _race) {
            if (err) {
                res.send('error has occured');
            } else {
                race = _race;

                if (req.user._id == race.ownerID) {
                    request(url, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var json = JSON.parse(body);

                            newWaypoint.place = json.result;
                            newWaypoint.raceid = req.params.id;

                            newWaypoint.save(function(err, waypoint) {
                                if (err) {
                                    res.send('error saving waypoint');
                                } else {
                                    res.redirect(redirectUrl);
                                }
                            })
                        }
                    })
                }
                else {
                    res.send('You are not the owner of this race, and therefore you cannot edit it.')
                }
            }
        })
    })

    //Completing a waypoint. rid = raceID, did = deelnemerID, wid = waypointID.
    app.post('/race/:rid/waypoint/complete/:did/:wid', isLoggedIn, function(req, res) {
        RaceDeelnemer.findOne({ _id: req.params.did }).exec(function(err, _deelnemer) {
            if (err) {
                res.send('error finding deelnemer');
            } else {
                _deelnemer.waypointsCompleted.push({ waypoint: { waypointID: req.params.wid } });
                _deelnemer.save(function(err) {
                    if (err) {
                        res.send('an error occured while completing waypoint');
                    }
                    else {
                        res.redirect('/race/deelnemer/' + req.params.rid);
                    }
                })
            }
        })
    })

    app.post('/race/join/:id', isLoggedIn, function(req, res) {
        var newDeelnemer = new RaceDeelnemer();

        newDeelnemer.userID = req.user.id;
        newDeelnemer.raceID = req.params.id;

        newDeelnemer.save(function(err, raceDeelnemer) {
            if (err) {
                res.send('error joining race');
            } else {
                res.redirect('/race/deelnemer/' + req.params.id);
            }
        })
    })

    app.post('/race', isLoggedIn, function(req, res) {
        var newRace = new Race();

        newRace.name = req.body.name;
        newRace.ownerID = req.user.id;

        newRace.save(function(err, race) {
            if (err) {
                res.send('error saving race');
            } else {
                res.send(race);
            }
        })
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.status(401);
    res.redirect('/');
}