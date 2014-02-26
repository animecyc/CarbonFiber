(function () {
    'use strict';

    var Iconic = function () {
        // Icon font-family

        this.family = 'fontello';

        // Icon listing

        this.iconChars = {
            menu       : 0xe800,
            share      : 0xe801,
            next       : 0xe802,
            search     : 0xe803,
            settings   : 0xe804,
            camera     : 0xe805,
            chevron    : 0xe806,
            play       : 0xe807,
            pause      : 0xe808,
            fullscreen : 0xe809,
            resize     : 0xe810,
            cc         : 0xe811,
            ellipsis   : 0xe812,
            back       : 0xe813,
            up         : 0xe814,
            twitter    : 0xe80A,
            facebook   : 0xe80B,
            close      : 0xe80C
        };
    };

    /**
     * Get the API used to generate labels
     *
     * @return {Ti.UI|CoreLabel}
     */
    Iconic.prototype.getApi = function () {
        return require('lib/carbonfiber/carbonfiber.platform').isIOS() ? require('com.animecyc.corelabel') : Ti.UI;
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
     * @return {Object}
     */
    Iconic.prototype.createIcon = function () {
        var props = {
            color : 'black',
            font : {
                fontSize : 16
            }
        };

        if (_.isString(arguments[0])) {
            if (arguments.length > 1 && _.isNumber(arguments[1])) {
                props.font.fontSize = parseInt(arguments[1], 10);
            }

            if (arguments.length > 2) {
                // If we are supplied with a string
                // assume that it is a color

                if (_.isString(arguments[2])) {
                    props.color = arguments[2];
                }

                // If we're an object extend our
                // currently set prop settings

                else if (_.isObject(arguments[2])) {
                    props = _.extend(props, arguments[2]);
                }
            }

            props.text = this.getIconAsText(arguments[0]);
        }
        else if (_.isObject(arguments[0]) && _.has(arguments[0], 'icon')) {
            _.extend(props, _.omit(arguments[0], 'icon'));

            props.text = this.getIconAsText(arguments[0].icon);
        }
        else {
            throw 'Icon name is required for icon creation';
        }

        props.font.fontFamily = this.getFamily();

        return this.getApi().createLabel(props);
    };

    exports = module.exports = new Iconic();
}).call(this);