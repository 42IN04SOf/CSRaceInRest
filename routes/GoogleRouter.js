var express = require('express');
var router = express.Router();

module.exports = function(passport, authHandler) {
	
	// =====================================
	// GOOGLE ROUTES =======================
	// =====================================
	// about scopes:
	// - profile gets us their basic information including their name
	// - email gets their emails
	var scopes = { scope: ['profile', 'email'] }

	// Send to google for authentication (signup)
	router.get('/authenticate', passport.authenticate('google', scopes));

	// The callback after google has authenticated the user (signup)
	router.get('/authenticate/callback', passport.authenticate('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

	// Send to google for authorization (connect)
	router.get('/authorize', passport.authorize('google', scopes));

	// the callback after google has authenticated the user
	router.get('/authorize/callback', passport.authorize('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));
	
	return router;
};