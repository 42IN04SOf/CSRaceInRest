// in MyNewRouter.js
var express = require('express');
var router = express.Router();

module.exports = function() {
    
    router.get('/', function(req, res) {
        res.send('global index');
    });
    
    return router;
};