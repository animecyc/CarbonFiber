(function () {
    'use strict';

    if (! Alloy.CarbonFiber) {
        throw 'CarbonFiber was not started correctly.';
    }

    Alloy.CarbonFiber.setWidgetController($);

    Alloy.CarbonFiber.subscribe($.carbon, {

        open : function () {
            _.defer(function () {
                Ti.App.fireEvent('carbonfiber:ready');
            });
        }

    });

    Alloy.CarbonFiber.subscribe(Ti.App, {

        'carbonfiber:init' : function () {
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
                Alloy.CarbonFiber.getDraggableView().enabled = false;

                $.carbon.open({
                    animated : false
                });
            }
        }

    });
}).call(this);