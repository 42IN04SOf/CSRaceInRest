var config = {};

config.google = {
    placesAPI: { key: "AIzaSyD1SgryAGvNa_bXpcaiAEBeHcbVxtQofTg" },
    client: {
        id: "74184454365-t803u4uvb5l14om7a2qmomg5i4s74irl.apps.googleusercontent.com",
        secret: "Ut6T1v9WwAnKLoIlK8v1X_I0" 
    }
};

config.db = {
    connection: 'mongodb://localhost:27017/restrace',
};

module.exports = config;