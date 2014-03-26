(function () {
    'use strict';

    if (! Alloy.CarbonFiber) {
        throw 'CarbonFiber was not started correctly.';
    }

    Alloy.CarbonFiber.setWidgetController($);

    Alloy.CarbonFiber.subscribe($.carbon, {

        open : function () {
            Ti.App.fireEvent('carbonfiber:ready');
        }

    });

    if (Alloy.isTablet) {
        var launchedLandscape = Ti.Gesture.isLandscape();

        Ti.Gesture.addEventListener('orientationchange', function () {

            _.defer(function () {
                $.content.setWidth(launchedLandscape ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth);
            });

        });
    }

    if (Alloy.CarbonFiber.platform.isIOS()) {
        Alloy.CarbonFiber.subscribe($.behind, {
            open : function () {
                $.carbon.open();
            }
        });

        _.defer(function () {
            $.behind.open();
        });
    }
    else {
        $.carbon.open();
    }
}).call(this);