(function () {
	'use strict';

	var Context = function () {
		this.contexts = [];
	};

    /**
     * Set options for CarbonFiber
     *
     * @param {String}  type     The type of option to change
     * @param {Object}  options  An object describing option changes
     * @param {Boolean} extend   Extend the corrently set object
     */
    Context.prototype.setOptions = function (type, options, extend) {
        switch (type) {
            case 'draggable' :
                if (extend) {
                    var currentProps = JSON.parse(JSON.stringify(this.getDraggableView().draggable));

                    _.extend(options, currentProps);
                }

                this.getDraggableView().draggable.setConfig(options);
                break;
            default :
                // NOOP
                break;
        }
    };

    /**
     * Open a window and push it
     * onto the navigation stack
     *
     * @see http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.Window
     */
    Context.prototype.openWindow = function (windowToOpen, openParams) {
        if (this.platform.isIOS()) {
            this.getWidgetController().carbon.openWindow(windowToOpen, openParams || {});
        }
        else {
            windowToOpen.open(openParams || {});
        }

        Alloy.CarbonFiber.subscribe(windowToOpen, {
            close : function () {
                this.contexts = _.reject(this.contexts, function (context) {
                    return context === windowToOpen;
                });
            }
        }, this);

        this.contexts.push(windowToOpen);
    };

    /**
     * Close a window and remove it
     * from the navigation stack
     *
     * @see http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.Window
     */
    Context.prototype.closeWindow = function (windowToClose, closeParams) {
        if (this.platform.isIOS()) {
            this.getWidgetController().carbon.closeWindow(windowToClose, closeParams || {});
        }
        else {
            windowToClose.close(closeParams || {});
        }

        this.contexts = _.reject(this.contexts, function (context) {
            return context === windowToClose;
        });
    };

    /**
     * Get or create the status bar
     *
     * @return {Ti.UI.View}  The status bar (iOS only)
     */
    Context.prototype.getStatusBar = function () {
        if (this.platform.isIOS()) {
            return require('com.animecyc.statusbar').getStatusBar({
                opacity : 0,
                backgroundColor : '#1F1F1F'
            });
        }
        else {
            throw 'Platform [' + Ti.Platform.osname + '] does not support [getStatusBar]';
        }
    };

    /**
     * Get the content view
     *
     * @return {Ti.UI.View}  The Carbon content view
     */
    Context.prototype.getContentView = function () {
        return this.getWidgetController().content;
    };

    /**
     * Get the underlying "behind" view
     *
     * @return {Ti.UI.View}  The Carbon "behind" view
     */
    Context.prototype.getBehindView = function () {
        return this.getWidgetController().behind;
    };

    /**
     * Get the draggable view
     *
     * @return {Ti.UI.View}  Carbon's draggable view
     */
    Context.prototype.getDraggableView = function () {
        return this.platform.isIOS() ? this.getWidgetController().carbon : this.getWidgetController().contentWrapper;
    };

    /**
     * Set the widget controller
     *
     * @param {WidgetController} controller  The widget controller
     */
    Context.prototype.setWidgetController = function (controller) {
        this.widgetController = controller;
    };

    /**
     * Get the widget controller
     *
     * @return {WidgetController} controller  The widget controller
     */
    Context.prototype.getWidgetController = function () {
        if (! this.widgetController) {
            throw 'Widget controller has not been set';
        }

        return this.widgetController;
    };

    exports = module.exports = new Context();
}).call(this);