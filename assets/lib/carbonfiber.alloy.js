(function () {
    'use strict';

    var AlloyExtended = function () {
        this.platform = require('lib/carbonfiber/carbonfiber.platform');
        this.events = {};
        this.controllers = {};
    };

    /**
     * An alias of `Stapes.subclass` with
     * added sugar to make the class accessible
     * through an Alloy controller
     *
     * @param  {Controller} controller    The Alloy controller to inject into
     * @param  {Object}     construction  Object containing methods for construction
     * @param  {Boolean}    classOnly     Flag to only create the class (no events or dictionary)
     * @return {Stapes}                   The constructed subclass
     */
    AlloyExtended.prototype.composeController = function(controller, construction, classOnly) {
        _.extend(construction, {

            /**
             * An array of related controllers
             *
             * @type {Array}
             */
            relatedControllers : [],

            /**
             * An array of callbacks to be executed
             * when the composite controller is
             * disposed
             *
             * @type {Array}
             */
            disposeCallbacks : [],

            /**
             * A composed constructor to
             * ensure that the class instance
             * gets injected into an Alloy controller
             */
            constructor : _.compose(
                function () {
                    _.extend(controller, {

                        /**
                         * Constructed Stapes class
                         *
                         * @type {Stapes}
                         */
                        klass : this,

                        /**
                         * Properly destroy our composite controller
                         */
                        dispose : function () {
                            Alloy.CarbonFiber.log('Disposing Controller [' + this.__controllerPath + ']...');

                            if (_.has(this, 'klass')) {
                                if (this.klass.disposeCallbacks) {
                                    _.each(this.klass.disposeCallbacks, function (callback) {
                                        callback();

                                        callback = null;
                                    });

                                    delete this.klass.disposeCallbacks;
                                }

                                if (this.klass.relatedControllers) {
                                    _.each(this.klass.relatedControllers, function (related) {
                                        if (_.has(related, 'dispose') && _.isFunction(related.dispose)) {
                                            related.dispose();
                                        }

                                        related = null;
                                    });

                                    delete this.klass.relatedControllers;
                                }

                                this.klass.remove(function () {
                                    return true;
                                }, true);

                                delete this.klass;
                            }

                            var view = this.getView(),
                                views = this.getViews(),
                                complete = _.after(views.length, function () {
                                    if (view.getParent()) {
                                        view.parent.remove(view);
                                    }

                                    view = views = null;
                                });

                            _.each(views, function (view, id) {
                                var parent = view.getParent();

                                if (parent) {
                                    parent.remove(view);
                                }

                                this.removeView(id);

                                complete();

                                parent = view = id = null;
                            }, this);

                            this.destroy();
                        }

                    });
                },
                construction.constructor || function () {}
            ),

            /**
             * Add a disposal callback
             *
             * @param {Function} callback [description]
             */
            addDisposeCallback : function (callback, context) {
                this.disposeCallbacks.push(_(callback).bind(context));

                callback = context = null;
            },

            /**
             * Create a controller that will
             * be associated to this controller;
             * This allows us to keep track and
             * dispose of composite controllers
             * more easily
             *
             * @return {CompositeController} Composite controller
             */
            createRelatedController : function () {
                var relController = Alloy.createController.apply(Alloy, arguments);

                this.relatedControllers.push(relController);

                return relController;
            }

        });

        return new (require('lib/carbonfiber/util.stapes').subclass(construction, classOnly));
    };

    /**
     * Create a controller and apply
     * a set of supplied bindings
     *
     * @param {[type]} controller  Controller to create
     * @param {[type]} bindings    Bindings to apply
     * @param {[type]} args        Arguments to pass to the factory
     */
    AlloyExtended.prototype.createControllerWithBindings = function (controller, bindings, args) {
        if (! _.isString(controller)) {
            throw 'Controller name must be a valid string.';
        }

        var instance = new (require('alloy/controllers/' + controller))(args);

        if (! _.isObject(bindings)) {
            throw 'Bindings are required and must be an object.';
        }

        _.each(bindings, function (value, key) {
            if (_.has(instance, key)) {
                if (_.has(value, 'classes')) {
                    _.each(_.isArray(value.classes) ? value.classes : value.classes.split(' '), function (_class) {
                        instance.addClass(instance[key], _class);
                    });
                }

                this.applyProperties(instance[key], _.omit(value, 'classes'));
            }
        }, this);

        return instance;
    };

    /**
     * Apply properties to a proxy correctly
     * for iOS and Android
     *
     * @param {Ti.Proxy} proxy  Proxy to apply to
     * @param {Object}   props  Properties to apply
     */
    AlloyExtended.prototype.applyProperties = function (proxy, props) {
        if (! _.isObject(props)) {
            throw 'Supplied properties must be an object';
        }

        if (this.platform.isIOS()) {
            proxy.applyProperties(props);
        }
        else {
            _.each(props, function (value, key) {
                proxy[key] = value;
            });
        }
    };

    /**
     * Create an alloy event that can be accessed
     * out of controller context (Alloy event shim)
     *
     * @param {String}     eventName  The name of the event
     * @param {Function}   callback   The function to be called
     * @param {Object}     context    Optional: The context to apply to the callback
     */
    AlloyExtended.prototype.createEvent = function (eventName, callback, context) {
        this.events[eventName] = _(callback).bind(context);
    };

    /**
     * Get the event from the extended
     * alloy global events
     *
     * @param  {String}   eventName  The name of the event to get
     * @return {Function}            The event callback
     */
    AlloyExtended.prototype.getEvent = function (eventName) {
        var self = this;

        return function () {
            if (! _.has(self.events, eventName)) {
                Alloy.CarbonFiber.log('The Alloy event [' + eventName + '] could not be found.')
            }
            else {
                var callback = self.events[eventName];

                return callback.apply(callback, arguments);
            }
        };
    };

    /**
     * Remove an event from the global event list
     *
     * @param  {String|Array} events Events to remove from listing
     */
    AlloyExtended.prototype.clearEvent = function (events) {
        if (_.isArray(events)) {
            this.events = _.omit(this.events, events);
        }
        else if (_.isString(events)) {
            this.events = _.omit(this.events, [ events ]);
        }
        else {
            throw 'Event must either be an Array or String';
        }
    };

    /**
     * Get a global cached controller
     *
     * @param  {String}     name The name of the controller
     * @return {Controller}      The cached controller
     */
    AlloyExtended.prototype.getGlobalController = function (name) {
        if (_.has(this.controllers, name)) {
            return this.controllers[name];
        }

        throw '[' + name + '] has not been registered as a global controller';
    };

    /**
     * Override for controller creation
     *
     * @param  {String}     name The name of the controller
     * @param  {Object}     args Arguments to pass to the controller factory
     * @return {Controller}      The requested controller
     * @see http://docs.appcelerator.com/titanium/latest/#!/api/Alloy-method-createController
     */
    AlloyExtended.prototype._createController = Alloy.createController;
    AlloyExtended.prototype.createController = function(name, args) {
        Alloy.CarbonFiber.log('Creating controller [' + name + ']...');

        var isGlobal = _.isObject(args) && (args.global == 'true' || args.global == 1),
            controller;

        if (isGlobal && _.has(this.controllers, name)) {
            return this.controllers[name];
        }

        controller = this._createController(name, args);

        if (isGlobal) {
            this.controllers[name] = controller;
        }

        return controller;
    };

    /**
     * Override for model creation
     *
     * @param  {String} name  The model to create
     * @param  {Object} args  Model arguments
     * @return {Model}        The requested model
     * @see http://docs.appcelerator.com/titanium/latest/#!/api/Alloy-method-createModel
     */
    AlloyExtended.prototype._createModel = Alloy.createModel;
    AlloyExtended.prototype.createModel = function(name, args) {
        Alloy.CarbonFiber.log('Creating model [' + name + ']...');

        return this._createModel(name, args);
    };

    /**
     * Override for collection creation
     *
     * @param  {String}     name  The name of the collection
     * @param  {Object}     args  Collection arguments
     * @return {Collection}       The requested collection
     * @see http://docs.appcelerator.com/titanium/latest/#!/api/Alloy-method-createCollection
     */
    AlloyExtended.prototype._createCollection = Alloy.createCollection;
    AlloyExtended.prototype.createCollection = function(name, args) {
        Alloy.CarbonFiber.log('Creating collection [' + name + ']...');

        return this._createCollection(name, args);
    };

    exports = module.exports = new AlloyExtended();
}).call(this);