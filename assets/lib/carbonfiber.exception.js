(function () {
	'use strict';

	function CarbonFiberException(name, exception) {
		this.name = name;
		this.file = exception.sourceURL.replace(/(.*)\.(app|apk)/, '');
		this.line = exception.line;
		this.message = exception.message + ' on line ' + this.line + ' in file ' + this.file;
		this.backtrace = exception.backtrace;
	}

	CarbonFiberException.prototype = Error.prototype;

	CarbonFiberException.prototype.getStackTrace = function () {
		var stack = _.map(this.backtrace.split('\n'), function (trace) {
			trace = trace.replace(/(.*)\.(app|apk)/, '').match(/(.+):(\d+)/);

			return {
				file : trace[1],
				line : trace[2]
			};
		});

		stack.unshift({
			file : this.file,
			line : this.line
		});

		return stack;
	};

	exports = module.exports = {

		exceptions : {
			'json' : 'JSONParseException',
			'argument' : 'InvalidArgumentException'
		},

		handleException : function (type, exception) {
			if (Alloy.CarbonFiber.platform.isIOS()) {
				if (! (exception instanceof Error)) {
					this.handleException('argument', new Error('Type of exception must be Error, ' + (typeof exception) + ' supplied'));

					return;
				}

				var name = _.has(this.exceptions, type) ? this.exceptions[type] : 'ErrorException',
					error = new CarbonFiberException(name, exception);

				if (Alloy.CFG.build === 'development') {
					throw error;
				}
				else {
					// NOOP (for the time being)
				}
			}
			else {
				throw exception;
			}
		}

	};
}).call(this);