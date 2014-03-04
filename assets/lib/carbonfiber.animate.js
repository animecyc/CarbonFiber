(function () {
	'use strict';

	/**
	 * Animation library for Carbon
	 */
	var CarbonAnimation = function () {
		this.animator = require('com.animecyc.animator');
		this.propertyProxy = require('lib/carbonfiber/carbonfiber.propertyProxy');
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
			properties = _.extend(properties, { opaque : true, duration : 250 });

			this.animator.animate(view, properties, function () {
				if (_.isFunction(callback)) {
					callback.call(self);
				}
			});
		}
	};

	/**
	 * Animate a class addition
	 *
	 * @param {Controller} controller The Alloy controller to pull styles form
	 * @param {Ti.UI.View} view       The view to apply the class animation
	 * @param {Object}     properties A dictionary of properties to animate
	 * @param {Function}   callback   Function to call when animation completes
	 */
	CarbonAnimation.prototype.addClassAnimated = function (controller, view, properties, callback) {
		var self = this,
			proxy = new this.propertyProxy(view);

		controller.addClass(proxy, properties.classes.split(' '));

		this.animate(
			view,
			_.extend(_.omit(properties, 'classes'), proxy.finalize()),
			function () {
				if (_.isFunction(callback)) {
					callback.call(self);
				}
			}
		);
	};

	/**
	 * Animate a class removal
	 *
	 * @param {Controller} controller The Alloy controller to pull styles form
	 * @param {Ti.UI.View} view       The view to apply the class animation
	 * @param {Object}     properties A dictionary of properties to animate
	 * @param {Function}   callback   Function to call when animation completes
	 */
	CarbonAnimation.prototype.removeClassAnimated = function (controller, view, properties, callback) {
		var self = this,
			proxy = new this.propertyProxy(view);

		controller.removeClass(proxy, properties.classes.split(' '));

		this.animate(
			view,
			_.extend(_.omit(properties, 'classes'), proxy.finalize()),
			function () {
				if (_.isFunction(callback)) {
					callback.call(self);
				}
			}
		);
	};

	exports = module.exports = new CarbonAnimation();
}).call(this);