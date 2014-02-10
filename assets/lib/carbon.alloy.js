(function () {
    'use strict';

    var AlloyExtended = function () {
        this.platform = require('lib/carbonfiber/util.platform');
    };

    AlloyExtended.prototype.subclass = function($, construction, classOnly) {
        _.extend(construction, {
            constructor : _.compose(
                function () {
                    _.extend($, { klass : this });
                },
                construction.constructor || function () {}
            )
        });

        return require('lib/carbonfiber/util.stapes').subclass(construction, classOnly);
    };

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

    exports = module.exports = new AlloyExtended();
}).call(this);