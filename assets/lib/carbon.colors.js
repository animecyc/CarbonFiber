(function () {
	'use strict';

    /**
     * Color library for Carbon
     */
	var Colors = function () {
        this.colors = {
            aqua : "#00ffff",
            black : "#000000",
            blue : "#0000ff",
            fuchsia : "#ff00ff",
            gray : "#808080",
            green : "#008000",
            lime : "#00ff00",
            maroon : "#800000",
            navy : "#000080",
            olive : "#808000",
            purple : "#800080",
            red : "#ff0000",
            silver : "#c0c0c0",
            teal : "#008080",
            white : "#ffffff",
            yellow : "#ffff00"
        };
	};

    /**
     * Get the hex value from our basic
     * color object
     *
     * @param  {String} color [description]
     * @return The hex string corresponding to the given color
     */
    Colors.prototype.getHex = function (color) {
        if (color.substr(0, 1) !== '#' && _.has(this.colors, color)) {
            return this.colors[color];
        }

        return color;
    };

    /**
     * Darken a color by a given percentage
     *
     * @param  {String} color   The color to manipulate
     * @param  {Number} percent The percentage to manipulate by
     * @return THe manipulated color
     */
    Colors.prototype.darken = function (color, percent) {
        return this.brightness(color, - Math.abs(percent));
    };

    /**
     * Lighten a color by a given percentage
     *
     * @param  {String} color   The color to manipulate
     * @param  {Number} percent The percentage to manipulate by
     * @return THe manipulated color
     */
    Colors.prototype.lighten = function (color, percent) {
        return this.brightness(color, Math.abs(percent));
    };

    /**
     * Change the brightness of a color
     * based on a given percentage
     *
     * @param  {String} color   The color to manipulate
     * @param  {Number} percent The percentage to manipulate by
     * @return THe manipulated color
     */
	Colors.prototype.brightness = function (color, percent) {
        var num = parseInt(this.getHex(color).slice(1), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt,
            ensureComponent = function (component) {
                return (component < 255 ? (component < 1 ? 0 : component) : 255);
            };

        return '#' + (0x1000000 + ensureComponent(R) * 0x10000 + ensureComponent(G) * 0x100 + ensureComponent(B)).toString(16).slice(1);
    };

	exports = module.exports = new Colors();
}).call(this);