var mongoose    = require('mongoose');

// require models
var Race        = require('./models/race.js');
var RaceDeelnemer = require('./models/racedeelnemer.js');

module.exports = function(app, passport) {
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
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
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
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
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
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));
    
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/connect/google/callback', passport.authorize('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));
    
    // the races list page
    app.get('/race', isLoggedIn, function(req, res) {
        
        var myRaces;
        var deelnemend;
        var races;
        
        Race.find({ ownerID: req.user._id }).exec(function(err, _myRaces) {
            if(err) {
                res.send('error has occured');
            } else {
                myRaces = _myRaces;

                Race.find({}).exec(function(err, _allRaces) {                    
                    if(err) {
                        res.send('error has occured');
                    } else {
                        races = _allRaces;
                        
                        RaceDeelnemer.find({ userID: req.user._id }).exec(function(err, _deelnemend) {
                           if(err) {
                               res.send('error has occured');
                           } else {
                               var ids = [];
                               
                               for(i = 0; i < _deelnemend.length; i++) {
                                    ids[i] = _deelnemend.raceID;
                               }
                               
                               Race.find({ _id: { $in: ids } }).exec(function(err, _deelnemendRace) {
                                   if(err) {
                                       res.send('error has occured');
                                   } else {
                                       deelnemend = _deelnemendRace;

                                       res.render('race.ejs', {
                                            user : req.user, // get the user out of session and pass to template
                                            myraces : myRaces,
                                            deelnemendraces: deelnemend,
                                            races : races
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
    
    app.post('/race/join/:id', isLoggedIn, function(req, res) {
        var newDeelnemer = new RaceDeelnemer();
        
        newDeelnemer.userID = req.body.id;
        newDeelnemer.raceID = req.params.id;
        
        newDeelnemer.save(function(err, raceDeelnemer) {
            if(err) {
                res.send('error joining race');
            } else {
                res.send(raceDeelnemer);
            }
        })
    })
    
    app.post('/race', isLoggedIn, function(req, res) {
        var newRace = new Race();
        
        newRace.name = req.body.name;
        newRace.ownerID = req.user.id;
        
        newRace.save(function(err, race) {
            if(err) {
                res.send('error saving race');
            } else {
                res.send(race);
            }
        })
        /*
        var RaceModel = mongoose.model('Race');
        var newModel = new RaceModel(callbacks.create(req, res));
        
        newModel.save(function(err) {
            if(err) { return next(err); }
            req[model] = newModel;
            next();
        });
        */
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}