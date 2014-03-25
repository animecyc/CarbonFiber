(function () {
    'use strict';

    var Utilities = function () {};

    /**
     * Subscribe a Ti.Proxy to a list of events
     *
     * @param {Ti.Proxy} proxy         The proxy to subscribe to
     * @param {Object}   subscription  An object containing the subscription
     * @param {Object}   context       Optional: The context for the callback
     */
    Utilities.prototype.subscribe = function (proxy, subscription, context) {
        var scope = context || this;

        if (proxy && _.isObject(subscription)) {
            _.each(subscription, function (callback, events) {
                _.each(events.split(' '), function (name) {

                    // We want to ensure that the scope
                    // of each event matches the widget's
                    // scope so we can call related properties

                    proxy.addEventListener(name, function (event) {
                        callback.call(scope, event);
                    });
                });

                delete subscription[events];
            });
        }

        proxy = subscription = context = null;
    };

    /**
     * Fits the image into a specified dimension
     *
     * @param  {Number} imageWidth   Width of the image
     * @param  {Number} imageHeight  Height of the image
     * @param  {Number} fitWidth     Width to fit
     * @param  {Number} fitHeight    Height to fit
     * @param  {String} dimension    Dimension to scale
     * @return {Array}               The fitted dimensions
     */
    Utilities.prototype.fitImage = function(imageWidth, imageHeight, fitWidth, fitHeight, dimension) {
        var ratio = imageWidth / imageHeight,
            width, height;

        if (dimension === 'width') {
            width = fitWidth;
            height = Math.round(fitWidth / ratio);
        }
        else {
            height = fitHeight;
            width = Math.round(fitHeight * ratio);
        }

        return [width, height];
    };

    exports = module.exports = new Utilities();
}).call(this);