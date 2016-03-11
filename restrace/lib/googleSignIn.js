var exampleGoogleConfig = {
    placesAPI: { key: "AIzaSyD1SgryAGvNa_bXpcaiAEBeHcbVxtQofTg" },
    client: {
        id: "74184454365-t803u4uvb5l14om7a2qmomg5i4s74irl.apps.googleusercontent.com",
        secret: "Ut6T1v9WwAnKLoIlK8v1X_I0" 
    }
};

var google = {
    scopes: ['https://www.googleapis.com/auth/plus.me'],
    redirectUri: 'http://localhost:3000/oauth',
    endpoint: {
        authoriation2: 'https://accounts.google.com/o/oauth2/v2/auth',
        authoriation: 'https://accounts.google.com/o/oauth2/auth',
        token: 'https://www.googleapis.com/oauth2/v3/token'
    },
    init: function(modules, googleConfig) {
        this.placesAPI = googleConfig.placesAPI;
        this.client = googleConfig.client;
    },
    getAuthorizationUrl: function() { 
    },
    exchangeAuthorizationCode: function() { },
    refreshAccessToken: function() { },
    revokeAccessToken: function() { }
};

function buildAuthorizationUrlQueryParameter(querystring, params) {
    return querystring.stringify({
        response_type: 'code',
        client_id: params.client.id,
        redirect_uri: params.redirectUri,
        scope: params.scopes.join(' '),
        state: params.state,
        access_type: 'offline'
    });
}

module.exports = google.init;
