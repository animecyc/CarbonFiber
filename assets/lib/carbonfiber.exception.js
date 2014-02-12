(function () {
	'use strict';

	function InvalidArgumentException(message) {
	    this.name = 'InvalidArgumentException';
	    this.message = message || '';
	}

	InvalidArgumentException.prototype = Error.prototype;

	function JSONParseException(message) {
	    this.name = 'JSONParseException';
	    this.message = message || '';
	}

	JSONParseException.prototype = Error.prototype;
}).call(this);