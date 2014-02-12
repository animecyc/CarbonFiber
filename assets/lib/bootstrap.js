(function () {
    'use strict';

    function WPATH(s) {
        var index = s.lastIndexOf('/');

        return -1 === index ? 'carbonfiber/' + s : s.substring(0, index) + '/carbonfiber/' + s.substring(index + 1);
    }

    if (! Alloy.CarbonFiber) {
        var CarbonFiber = require(WPATH('lib/util.stapes')).subclass({

            /**
             * Widget controller instance
             *
             * @type {WidgetController}
             */
            widgetController : null,

            /**
             * Creates a new instance of CarbonFiber
             */
            constructor : function () {
                this.log('Loading CarbonFiber...');

                this.load(WPATH('lib/carbonfiber.platform'), 'platform');
                this.load(WPATH('lib/carbonfiber.iconic'), 'iconic');

                this.mixin(WPATH('lib/carbonfiber.alloy'), Alloy);
                this.mixin(WPATH('lib/carbonfiber.animate'));
                this.mixin(WPATH('lib/carbonfiber.colors'));
                this.mixin(WPATH('lib/carbonfiber.utility'));
                this.mixin(WPATH('lib/carbonfiber.context'));

                this.log('Setting up globals...');

                _.str = require('lib/carbonfiber/util.underscore.string');
                _.mixin(_.str.exports());

                this.log('Shimming Backbone...');

                // If the version of Backbone being used
                // does not have the `once` method/event
                // handler shim it in

                if (! _.has(Backbone.Model.prototype, 'once')) {
                    _.extend(Backbone.Model.prototype, {
                        once : function (name, callback, context) {
                            var self = this,
                                once = function () {
                                    self.off(name, once);
                                    callback.apply(this, arguments);
                                };

                            return this.on(name, once, context);
                        }
                    });
                }

            },

            /**
             * Load a library into CarbonFiber
             * with the supplied namespace
             *
             * @param {String} library    The CommonnJS library to load
             * @param {String} namespace  The namespace place it in
             */
            load : function (library, namespace) {
                if (namespace && _.isString(namespace)) {
                    namespace = namespace.toLowerCase();

                    if (! _.has(this, namespace)) {
                        this[namespace] = require(library);
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
             * Add properties and methods to CarbonFiber
             */
            mixin : function () {
                _.extend(arguments.length > 0 && _.isUndefined(arguments[1]) ? this : arguments[1] , _.isString(arguments[0]) ? require(arguments[0]) : arguments[0]);
            },

            /**
             * Log messages against the console
             */
            log : function (message, indent) {
                if (Alloy.CFG.debug) {
                    indent = indent || 0;

                    if (! _.isNumber(indent)) {
                        indent = parseInt(indent, 10);
                    }

                    console.log('CarbonFiber ~' + Array(Math.abs(indent)).join('~') + '> ' + message);
                }
            }

        });

        Alloy.CarbonFiber = new CarbonFiber();
    }
}).call(this);