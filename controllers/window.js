(function (options) {
    'use strict';

    // Add an activity indicator

    var activityIndicator = $.UI.create('ActivityIndicator', {
        style : Ti.UI.ActivityIndicatorStyle.BIG
    });

    activityIndicator.show();

    $.content.add(activityIndicator);

    // Set the title

    if (_.has(options, 'title')) {
        $.navigationBar.add(options.title);
    }

    // Set the right nav icon

    if (_.has(options, 'rightNav')) {
        if (_.has(options.rightNav, 'icon')) {
            var iconView = $.UI.create('Alloy.CarbonFiber.iconic.Icon', {
                icon : options.rightNav.icon,
                classes : 'icon'
            });

            $.rightNavIcon.add(iconView);

            if (_.has(options.rightNav, 'subscription')) {
                Alloy.CarbonFiber.subscribe($.rightNavIcon, options.rightNav.subscription);
            }
        }
        else {
            $.navigationBar.remove($.rightNavIcon);
        }
    }

    // Setup event for left nav icon

    Alloy.CarbonFiber.subscribe($.leftNavIcon, {
        click : function () {
            Alloy.CarbonFiber.closeWindow($.getView());
        }
    });

}).call(this, arguments[0] || {});