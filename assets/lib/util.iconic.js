(function () {
	'use strict';

	var Iconic = function () {
		// Icon font-family

		this.family = 'fontello';

		// Icon listing

		this.iconChars = {
			menu     : 0xe800,
			share    : 0xe801,
			next 	 : 0xe802,
			search   : 0xe803,
			settings : 0xe804,
			camera   : 0xe805,
			chevron  : 0xe806
		};
	};

	/**
	 * Get the font-family name
	 *
	 * @return {String}
	 */
	Iconic.prototype.getFamily = function () {
		return this.family;
	};

	/**
	 * Get icon text
	 *
	 * @param  {String} icon
	 * @return {String}
	 */
	Iconic.prototype.getIconAsText = function (icon) {
		if (! _.has(this.iconChars, icon)) {
			throw 'Could not find icon [' + icon + ']';
		}

		return String.fromCharCode(this.iconChars[icon]);
	};

	/**
	 * Create and return an icon (label)
	 *
	 * @param  {String} icon
	 * @param  {Number} size
	 * @param  {Object} opts
	 * @return {String}
	 */
	Iconic.prototype.createIcon = function (icon, size, opts) {
		var props = {
				color : 'black',
				font : {
					fontFamily : this.getFamily(),
					fontSize : size || 16
				}
			};

		// If we are supplied with a string
		// assume that it is a color

		if (_.isString(opts)) {
			props.color = opts;
		}

		// If we're an object extend our
		// currently set prop settings

		else if (_.isObject(opts)) {
			props = _.extend(props, opts);
		}

		// Get and set the icon text

		props.text = this.getIconAsText(icon);

		return Alloy.Globals.Telemundo.getLabelFactory().createLabel(props);
	};

	exports = module.exports = new Iconic();
}).call(this);