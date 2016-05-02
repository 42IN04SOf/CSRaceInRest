// This module allows the consumer to locate text in external language resource files.
// used for multilanguage support.

// PARAMETERS
// basePath : string
// 		contains path to external language resource files.
// config : object
//		contains 'default' & 'fallback' for locating default and fallback language resource files.

// REFERENCE
// middleware(req, res, next) : function
// 		middleware function that captures requested language from the current request.
// translate
// 		uses the provided identifier to:
//		- locate the external file
// 		- load the external file
// 		- retrieve the requested string
// 		- return the requested string.

// usage
// var translator = require(yourpath/translator);
// translator = translator(resourcepath, config);
//
// optional:
// app.use(translator.middleware);
//
// console.log(translator.translate('filename.mykey'));
// [[Will load: resourcepath/filename]]
// [[returns value with key: mykey]]
 
module.exports = function(basePath, config) {
	config = config || {
        'primary': 'nl',
        'fallback': 'en'
    };
	
	var SPLIT = '.';
	var DS = '/'
	var MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';
	var requestedLanguage;
	
	var getLangFromRequest = function(req) {
		return req.query.lang; // <--------------------------------------------------- 
	}	
	var splitIdentifier = function(identifier) {
		argsArray = identifier.split(SPLIT);
		var x = {
			'file': argsArray.slice(0, -1).join(DS),
			'key': argsArray[argsArray.length - 1]
		}
		return x;
	}
	var loadFile = function(file, language) {
		if(!language) { return false; }
		try
		{
			return require(basePath + DS + language + DS + file);
		}
		catch(err)
		{
			if(err.code === MODULE_NOT_FOUND)
			{
				return false;
			}
		}
	}
	
	return {
		middleware: function(req, res, next) {
			requestedLanguage = getLangFromRequest(req);
			next();
		},
		translate: function(identifier) {
			var args = splitIdentifier(identifier);
			var dictionary = loadFile(args['file'], requestedLanguage)[args['key']]
				|| loadFile(args['file'], config.default)[args['key']]
				|| loadFile(args['file'], config.fallback)[args['key']]
				|| args['key'];
			return dictionary;
		}
	};
};