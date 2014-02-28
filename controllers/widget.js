(function () {
    'use strict';

    if (! Alloy.CarbonFiber) {
        throw 'CarbonFiber was not started correctly.';
    }

    Alloy.CarbonFiber.setWidgetController($);

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