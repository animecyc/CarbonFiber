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

            this.mixin(WPATH('lib/carbon.alloy'), Alloy);
            this.mixin(WPATH('lib/carbon.animate'));
            this.mixin(WPATH('lib/carbon.colors'));

            this.createAlloyEvent('revealMenu', function () {
                Alloy.Globals.Telemundo.set('menuIsRevealing', ! Alloy.Globals.Telemundo.get('menuIsRevealing'));
            });

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
         * Get the draggable view
         *
         * @return Carbon's draggable view
         */
        getDraggableView : function () {
            return this.platform.isIOS() ? $.carbon : $.contentWrapper;
        },

        /**
         * Set options for CarbonFiber
         *
         * @param {String}  type    The type of option to change
         * @param {Object}  options An object describing option changes
         * @param {Boolean} extend  Extend the corrently set object
         */
        setOptions : function (type, options, extend) {
            switch (type) {
                case 'draggable' :
                    if (extend) {
                        var currentProps = JSON.parse(JSON.stringify(this.getDraggableView().draggable));

                        _.extend(options, currentProps);
                    }

                    this.getDraggableView().draggable.setConfig(options);
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
            _.extend(arguments.length > 0 && _.isUndefined(arguments[1]) ? this : arguments[1] , _.isString(arguments[0]) ? require(arguments[0]) : arguments[0]);
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
         * Create an alloy event that can be accessed
         * out of controller context (Alloy event shim)
         *
         * @param  {String}     name     The name of the event
         * @param  {Function}   callback The function to be called
         * @param  {Object}     context  Optional: The context to apply to the callback
         * @param  {Controller} context  Optional: The controller to apply shimmed events
         */
        createAlloyEvent : function (name, callback, context, controller) {
            var _controller = controller || $;

            if (! _.isObject(_controller)) {
                throw 'Invalid controller';
            }

            if (! _.has(_controller, 'EVENT')) {
                _.extend(_controller, { EVENT : { } });
            }

            if (_.has(_controller.EVENT, name)) {
                throw 'Cannot create duplicate event [' + name + ']';
            }

            _controller.EVENT[name] = _(callback).bind(context || this);
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