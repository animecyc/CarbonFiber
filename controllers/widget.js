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
         * Creates an instance of Carbon
         *
         * @return {Carbon} The Carbon instance
         */
        constructor : function () {
            this.load(WPATH('lib/util.platform'), 'platform');
            this.load(WPATH('lib/util.iconic'), 'iconic');

            this.mixin(WPATH('lib/carbon.animate'));
            this.mixin(WPATH('lib/carbon.colors'));

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
        },

        /**
         * Extend Carbon
         */
        mixin : function () {
            _.extend(this, _.isString(arguments[0]) ? require(arguments[0]) : arguments[0]);
        },

        /**
         * Load a library into Carbon
         * with the supplied namespace
         *
         * @param  {String} lib       The CommonnJS library to load
         * @param  {String} namespace The namespace place it in
         */
        load : function (lib, namespace) {
            if (namespace && _.isString(namespace)) {
                namespace = namespace.toLowerCase();

                if (! _.has(this, namespace)) {
                    this[namespace] = require(lib);
                }
                else {
                    throw 'Namespace [' + namespace + '] is already taken';
                }
            }
            else {
                throw 'Invalid namespace supplied';
            }
        },

        /**
         * Subscribe a Ti.Proxy to
         * a list of events
         *
         * @param  {Ti.Proxy} proxy
         * @param  {Object} subscription
         * @param  {Object} context
         * @return undefined
         */
        subscribe : function (proxy, subscription, context) {
            var scope = context || this;

            if (proxy && _.isObject(subscription)) {
                _.each(subscription, function (callback, events) {
                    _.each(events.split(' '), function (name) {

                        // We want to ensure that the scope
                        // of each event matches the widget's
                        // scope so we can call related properties

                        var callable = function (event) {
                            callback.call(scope, event);
                        };

                        proxy.addEventListener(name, callable);
                    });
                });
            }
        }

    });

    exports = module.exports = Alloy.Globals.Carbon = new Carbon();
}).call(this);