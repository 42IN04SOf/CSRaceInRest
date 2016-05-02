module.exports = function(basePath, config) {
	config = config || {
        'primary': 'nl',
        'fallback': 'en'
    };
	
	var SPLIT = '.';
	var DS = '/'
	var MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';
	var requestedLanguage;
	
	var splitIdentifier = function(identifier) {
		argsArray = identifier.split(SPLIT);
		var x = {
			'file': argsArray.slice(0, -1).join(DS),
			'key': argsArray[argsArray.length - 1]
		}
		return x;
	}
	var getLangFromRequest = function(req) {
		return req.query.lang;
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