// This module allows the consumer to log colored text to the console.
// disclaimer: tested only for windows command line.
// ref: https://en.wikipedia.org/wiki/ANSI_escape_code

// reference
// modify(modifiers : array, message : string) : function
// 		modifies message parameter to be colorized.
// modifierDictionary : object
// 		contains all possible modifiers.

// usage
// var color = require(yourpath/colorizer);
// console.log(color.modify(['green', 'bgred'], 'your green text with red background'));

module.exports = (function() {
	var reset = '\x1b[0m';
	var getModifier = function(modifier) {
		if(!modifierDictionary[modifier])
			return '';
		return '\x1b[' + modifierDictionary[modifier] + 'm'; 
	}
	var modifierDictionary = {
		'bright'	: 5,
		'black'		: 30,
		'red'		: 31,
		'green'		: 32,
		'yellow'	: 33,
		'blue'		: 34,
		'magenta'	: 35,
		'cyan'		: 36,
		'white'		: 37,
		'bgblack'	: 40,
		'bgred'		: 41,
		'bggreen'	: 42,
		'bgyellow'	: 43,
		'bgblue'	: 44,
		'bgmagenta'	: 45,
		'bgcyan'	: 46,
		'bgwhite'	: 47
	}
	
	var parseModifiers = function(modifiers) {
		if(!modifiers || !Array.isArray(modifiers))
			return '';
		result = '';
		for(modifier of modifiers) {
			result += getModifier(modifier);
		}
		return result;
	}
	return {
		modify: function(modifiers, message) {
			return parseModifiers(modifiers) + message + reset;
		},
		modifierDictionary: Object.keys(modifierDictionary)
	}
})();