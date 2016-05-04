var express = require('express');
var router = express.Router();

// subrouters
var googleSubrouter = require('./GoogleRouter');

module.exports = function(passport, authHandler) {
	
	// subrouter initialization
	googleSubrouter = googleSubrouter(passport, authHandler);
	
	// =====================================
	// LOCAL LOGIN =========================
	// =====================================
	// show the login form
	router.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { title: 'auth.login', message: req.flash('loginMessage') });
	});

	// process the login form
	router.post('/login', passport.authenticate('local-login', {
		successRedirect	: '/profile', 		// redirect to the secure profile section
		failureRedirect	: '/login', 		// redirect back to the signup page if there is an error
		failureFlash	: true 				// allow flash messages
	}));

	// =====================================
	// LOCAL SIGNUP ========================
	// =====================================
	// show the signup form
	router.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { title: 'auth.signup',message: req.flash('signupMessage') });
	});
	// process the signup form
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect	: '/profile', 		// redirect to the secure profile section
		failureRedirect	: '/signup', 		// redirect back to the signup page if there is an error
		failureFlash	: true 				// allow flash messages
	}));

	// =====================================
	// LOGOUT ==============================
	// =====================================
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// Use Google authentication/authorization subrouter
	router.use('/auth/google', googleSubrouter);
	
	return router;
};
