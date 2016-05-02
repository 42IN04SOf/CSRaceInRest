// Middleware module that handles responses using the proper requested content-type.
//
// In your routehandlers use:
// - res.return(data) to return success
//      usage:  data should ALWAYS contain the key `result` with your raw data.
//              data can OPTIONALLY contain the key `view` if the request should be able to return a HTML-page.
// - res.error(statuscode, message) to return errors.
// - res.isHTMLRequested() to use conditional results.
//      reason: returned HTML data also contains viewdata as opposed to JSON or XML which only contains raw data.
//
module.exports = function(req, res, next) {
    var getReturnFormat = function() {
        return req.query.format; // <--------------------------------------------------- 
    }
    var returnAction = function(callbacks) {
        switch(getReturnFormat()) {
            case 'html':
            case undefined: // if format is undefined, client expects HTML
                return callbacks.html();
            case "json":
                if(callbacks.json) {
                    return callbacks.json(); 
                }
            default: // Some unsupported format is given.
                return callbacks.default();
        }
    } 
    // return handler
    res.return = function(data) {
        returnAction({
            html: function(){
                if(data.view) {
                    res.render(data.view, data.result);
                }
                else {
                    res.status(400).send('The content could not be viewed in a(n) HTML page.');
                }
            },
            json: function(){ res.json(data.result); },
            default: function(){ res.status(400).send('An unsupported format was specified in the format-query parameter.'); }
        });
    };
    // error handler
    res.error = function(statusCode, errorMessage) {
        returnAction({
            html: function() { res.render('error', { error: errorMessage }); },
            json: function() { res.status(statusCode).json({ error: errorMessage }); },
            default: function() { res.status(statusCode).send(errorMessage + '; An unsupported format was specified in the format-query parameter.'); }
        });
    }
    res.isHTMLRequested = function() {
        return returnAction({
            html: function() { return true; },
            default: function() { return false; }
        });
    }
    next();
};