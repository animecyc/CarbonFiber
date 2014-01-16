(function () {
    'use strict';

    var AlloyExtended = function () {};

    AlloyExtended.prototype.createControllerWithBindings = function (controller, bindings, args) {
        if (! _.isString(controller)) {
            throw 'Controller name must be a valid string.';
        }

        var instance = new (require("alloy/controllers/" + controller))(args);

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

                instance[key].applyProperties(_.omit(value, 'classes'));
            }
        }, this);

        return instance.getView();
    };

    exports = module.exports = new AlloyExtended();
}).call(this);