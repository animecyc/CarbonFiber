(function () {
    'use strict';

    if (! Alloy.CarbonFiber) {
        throw 'CarbonFiber was not started correctly.';
    }

    Alloy.CarbonFiber.setWidgetController($);

    if (Alloy.CarbonFiber.platform.isIOS()) {
        $.behind.addEventListener('open', function () {
            $.carbon.open();
        });

        $.behind.open();
    }
    else {
        $.carbon.open();
    }
}).call(this);