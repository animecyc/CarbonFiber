(function () {
    'use strict';

    var Platform = function () {
        var platform = Ti.Platform.osname,
            isTablet = false;

        if (platform === 'android') {
            var androidSizeCategory = Ti.Platform.Android.getPhysicalSizeCategory(),
                androidHandsetSizeWhitelist = [
                    Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_SMALL,
                    Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_NORMAL
                ];

            isTablet = _.contains(androidHandsetSizeWhitelist, androidSizeCategory) === false;

            if (isTablet) {
                if (androidSizeCategory === Ti.Platform.PHYSICAL_SIZE_CATEGORY_UNDEFINED && Math.min(Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight) > 700) {
                    isTablet = true;
                }
                else if (Math.min(Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight) > 720) {
                    isTablet = true;
                }
                else if (Ti.Platform.model.match(/kindle/i)) {
                    isTablet = true;
                }
                else {
                    isTablet = false;
                }
            }
        }
        else {
            isTablet = platform === 'ipad';
        }

        this._name = platform;
        this._isTablet = isTablet;
        this._measurement = require('alloy/measurement');
    };

    /**
     * Determine if platform is a handset
     *
     * @return {Boolean}
     */
    Platform.prototype.isHandset = function () {
        return ! this._isTablet;
    };

    /**
     * Determine if platform is a tablet
     *
     * @return {Boolean}
     */
    Platform.prototype.isTablet = function () {
        return this._isTablet;
    };

    /**
     * Determine if platform is Android
     *
     * @return {Boolean}
     */
    Platform.prototype.isAndroid = function () {
        return this._name === 'android';
    };

    /**
     * Determine if platform is iOS
     *
     * @return {Boolean}
     */
    Platform.prototype.isIOS = function () {
        return this._name === 'iphone' || this._name === 'ipad';
    };

    /**
     * Alias; Convert DiP to PX
     *
     * @param  {Number} dp
     * @return {Number}
     */
    Platform.prototype.dpToPx = function (dp) {
        return this.isIOS() ? dp : this._measurement.dpToPX(dp);
    };

    /**
     * Alias; Convert PX to DiP
     *
     * @param  {Number} px
     * @return {Number}
     */
    Platform.prototype.pxToDp = function (px) {
        return this.isIOS() ? px : this._measurement.pxToDP(px);
    };

    exports = module.exports = (function () {
        return new Platform();
    }).call(this);
}).call(this);