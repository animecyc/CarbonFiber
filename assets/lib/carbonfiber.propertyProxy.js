(function () {
    'use strict';

    /**
     * A proxy for routing properties
     *
     * @param {Ti.UI.View} view The view to assert properties against
     */
    var PropertyProxy = function (view) {
        if (_.isObject(view)) {
            this.__view = view;

            _.extend(this, view);
        }
        else {
            throw 'Invalid proxy parameters';
        }
    };

    /**
     * Apply properties to the prototype
     */
    PropertyProxy.prototype.applyProperties = function () {
        if (_.isObject(arguments[0])) {
            _.extend(this, arguments[0]);
        }
        else {
            throw 'Properties must be an object';
        }
    };

    /**
     * Applies the set classes to the
     * supplied Ti.UI.View and returns
     * the computed properties
     *
     * @return {Object} The computed properties
     */
    PropertyProxy.prototype.finalize = function () {
        this.__view.classes = this.classes;

        return _.omit(this, 'applyProperties', 'finalize', '__view', 'children', 'parent', 'size', 'rect');
    };

    exports = module.exports = PropertyProxy;
}).call(this);