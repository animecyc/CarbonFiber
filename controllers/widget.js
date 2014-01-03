(function () {
    'use strict';

    _.str = require(WPATH('lib/util.underscore.string'));

    var Carbon = require(WPATH('lib/util.stapes')).subclass({

        /**
         * Context reference store
         *
         * @type {Array}
         */
        contexts : [],

        /**
         * Platform utility
         *
         * @type {Platform}
         */
        platform : require(WPATH('lib/util.platform')),

        /**
         * Creates an instance of Carbon
         *
         * @return {Carbon} The Carbon instance
         */
        constructor : function () {
            if (this.platform.isIOS()) {
                $.behind.addEventListener('open', function () {
                    $.carbon.open();
                });

                $.behind.open();
            }
            else {
                $.carbon.open();
            }
        },

        /**
         * Get the content view
         *
         * @return {Ti.UI.View} The Carbon content view
         */
        getContentView : function () {
            return $.content;
        },

        /**
         * Get the underlying "behind" view
         *
         * @return {Ti.UI.View} The Carbon "behind" view
         */
        getBehindView : function () {
            return $.behind;
        },

        /**
         * Set options for CarbonFiber
         *
         * @param {String} type    The type of option to change
         * @param {Object} options An object describing option changes
         */
        setOptions : function (type, options) {
            switch (type) {
                case 'draggable' :
                    if (this.platform.isIOS()) {
                        $.carbon.draggable.setConfig(options);
                    }
                    else {
                        $.wrapper.draggable.setConfig(options);
                    }
                    break;
                default :
                    // NOOP
                    break;
            }
        },

        /**
         * Open a window and push it
         * onto the navigation stack
         *
         * @see http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.Window
         */
        openWindow : function (windowToOpen, openParams) {
            if (this.platform.isIOS()) {
                $.carbon.openWindow(windowToOpen, openParams || {});
            }
            else {
                windowToOpen.open(openParams || {});
            }

            this.contexts.push(windowToOpen);
        },

        /**
         * Close a window and remove it
         * from the navigation stack
         *
         * @see http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.Window
         */
        closeWindow : function (windowToClose, closeParams) {
            if (this.platform.isIOS()) {
                $.carbon.closeWindow(windowToClose, closeParams || {});
            }
            else {
                windowToClose.close(closeParams || {});
            }

            this.contexts = _.reject(this.contexts, function (context) {
                return context === windowToClose;
            });
        }

    });

    exports = module.exports = Alloy.Globals.Carbon = new Carbon();
}).call(this);