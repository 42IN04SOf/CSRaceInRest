var express = require('express');
var router = express.Router();

module.exports = function() {
    /* GET users listing. */
    router.get('/', function(req, res) {
        res.send('user index');
    });
    
    return router;
};
