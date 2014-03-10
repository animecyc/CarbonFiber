(function () {
	'use strict';

	function CarbonFiberException(name, exception) {
		this.name = name;
		this.file = exception.sourceURL ? exception.sourceURL.replace(/(.*)\.(app|apk)/, '') : '';
		this.line = exception.line;
		this.message = exception.message + ' on line ' + this.line + ' in file ' + this.file;
		this.backtrace = exception.backtrace;
		this.exceptionCallback = false;
	}

	CarbonFiberException.prototype = Error.prototype;

	CarbonFiberException.prototype.setExceptionCallback = function (callback) {
		this.exceptionCallback = callback;
	};

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

	exports = module.exports = _.extend(module.exports, {

		exceptions : {
			'json' : 'JSONParseException',
			'argument' : 'InvalidArgumentException'
		},

		handleException : function (type, exception) {
			var name = _.has(this.exceptions, type) ? this.exceptions[type] : 'ErrorException',
				CFEXC;

			if (Alloy.CarbonFiber.platform.isIOS()) {
				if (! (exception instanceof Error)) {
					throw this.handleException('argument', new Error('Type of exception must be Error, ' + (typeof exception) + ' supplied'));
				}

				CFEXC = new CarbonFiberException(name, exception);
			}
			else {
				console.error(
					'------ BOF: Exception Stack ------\n',
					exception.stack,
					'\n------ EOF: Exception Stack ------'
				);

				CFEXC = new CarbonFiberException(name, exception);
			}

			if (_.isFunction(this.exceptionCallback)) {
				this.exceptionCallback(exception.message);
			}
			else if(_.has(Alloy.Globals, 'CarbonFiberExceptionCallback')) {
				Alloy.Globals.CarbonFiberExceptionCallback(exception.message);
			}

			return CFEXC;
		}

	});
}).call(this);