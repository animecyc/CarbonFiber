(function () {
	'use strict';

	/**
	 * Animation library for Carbon
	 */
	var CarbonAnimation = function () {
		this.animator = require('com.animecyc.animator');
	};

	/**
	 * Animate a view
	 *
	 * @param {Ti.UI.View} view       The view to animate
	 * @param {Object}     properties A dictionary of properties to animate
	 * @param {Function}   callback   Function to call when animation completes
	 */
	CarbonAnimation.prototype.animate = function (view, properties, callback) {
		var self = this;

		if (view && _.isObject(properties)) {
			this.animator.animate(view, properties, function () {
				if (_.isFunction(callback)) {
					callback.call(self);
				}
			});
		}
	};

	exports = module.exports = new CarbonAnimation();
}).call(this);