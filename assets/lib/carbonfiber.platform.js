(function () {
    'use strict';

    var Platform = function () {
        this.name = Ti.Platform.osname;
        this.isTablet = Alloy.isTablet;
        this.measurement = require('alloy/measurement');
    };

    /**
     * Determine if platform is a handset
     *
     * @return {Boolean}
     */
    Platform.prototype.isHandset = function () {
        return ! this.isTablet;
    };

    /**
     * Determine if platform is a tablet
     *
     * @return {Boolean}
     */
    Platform.prototype.isTablet = function () {
        return this.isTablet;
    };

    /**
     * Determine if platform is Android
     *
     * @return {Boolean}
     */
    Platform.prototype.isAndroid = function () {
        return this.name === 'android';
    };

    /**
     * Determine if platform is iOS
     *
     * @return {Boolean}
     */
    Platform.prototype.isIOS = function () {
        return this.name === 'iphone' || this.name === 'ipad';
    };

    /**
     * Alias; Convert DiP to PX
     *
     * @param  {Number} dp
     * @return {Number}
     */
    Platform.prototype.dpToPx = function (dp) {
        return this.isIOS() ? dp : this.measurement.dpToPX(dp);
    };

    /**
     * Alias; Convert PX to DiP
     *
     * @param  {Number} px
     * @return {Number}
     */
    Platform.prototype.pxToDp = function (px) {
        return this.isIOS() ? px : this.measurement.pxToDP(px);
    };

    exports = module.exports = new Platform();
}).call(this);