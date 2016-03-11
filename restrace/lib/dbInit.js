module.exports = function(mongoose, dbConfig) {
    var middleware = dbConfig.middleware;

    var schemas = dbConfig.schemas;

    mongoose.connect(dbConfig.connection, function(err) {
        if(err) {
            console.log(`error: ${err}`);
        }
        else {
            console.log('Succesfully connected to the database');
        }
    });
    
    for(var i = 0; i < schemas.length; i++) {
        schemas[i](mongoose, middleware);
    }
}