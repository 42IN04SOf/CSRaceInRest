// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '74184454365-t803u4uvb5l14om7a2qmomg5i4s74irl.apps.googleusercontent.com',
        'clientSecret'  : 'bP-sHknCcfIuU6j-PgKMpFNK',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};