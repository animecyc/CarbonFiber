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

        this.getDraggableView().draggable.enabled = true;

        this.contexts = _.reject(this.contexts, function (context) {
            return context === windowToClose;
        });
    };

    /**
     * Create an android window
     *
     * @param  {Ti.UI.View} view View to add
     * @param  {Object} options
     * @param  {Boolean} lightweight
     * @return {Ti.UI.Window | Ti.UI.View}
     */
    Context.prototype.createAndroidWindow = function (view, options, lightweight) {
        var controller = Alloy.createController('../widgets/carbonfiber/controllers/window', options);

        controller.content.add(view);

        if (lightweight) {
            return controller.windowWrapper;
        }

        return controller.getView();
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
     * Add controller view to the content
     * view -- just a pass to add the controllers
     * top-level view
     *
     * @param {Controller} controller Controller to pull view from
     */
    Context.prototype.addContentView = function (controller) {
        this.getContentView().add(controller.getView());
    };

    /**
     * Add controller view to the behind
     * view -- just a pass to add the controllers
     * top-level view
     *
     * @param {Controller} controller Controller to pull view from
     */
    Context.prototype.addBehindView = function (controller) {
        this.getBehindView().add(controller.getView());
    };

    /**
     * Remove controller view from the content
     * view -- just a pass to add the controllers
     * top-level view
     *
     * @param {Controller} controller Controller to pull view from
     */
    Context.prototype.removeContentView = function (controller) {
        this.getContentView().remove(controller.getView());
    };

    /**
     * Remove controller view from the behind
     * view -- just a pass to add the controllers
     * top-level view
     *
     * @param {Controller} controller Controller to pull view from
     */
    Context.prototype.removeBehindView = function (controller) {
        this.getBehindView().remove(controller.getView());
    };

    /**
     * Create an icon used for navigation
     *
     * @param  {String}     icon         Icon to use
     * @param  {Object}     subscription Events to subscribe to
     * @return {Ti.UI.View}              The resultant icon
     */
    Context.prototype.createNavIcon = function (icon, subscription, opts) {
        opts = opts || {};

        var controller = this.getWidgetController(),
            iconContainer = controller.UI.create('Ti.UI.View', {
                classes : 'icon-container'
            }),
            iconView;

        if (icon) {
            _.extend(opts, {
                icon : icon,
                classes : 'icon'
            });

            iconView = controller.UI.create('Alloy.CarbonFiber.iconic.Icon', opts);

            if (iconView) {
                iconContainer.add(iconView);
            }

            if (_.isObject(subscription)) {
                Alloy.CarbonFiber.subscribe(iconContainer, subscription);
            }
        }

        return iconContainer;
    };

    /**
     * Set the left navigation icon
     *
     * @param {String}  icon         Icon to use
     * @param {Boolean} window       Window to use
     * @param {Object}  subscription Events to subscribe to
     */
    Context.prototype.setLeftNavIcon = function (icon, subscription, window) {
        var iconView = this.createNavIcon(icon, subscription, {
            left : Alloy.CarbonFiber.platform.isIOS() ? 0 : null
        });

        if (Alloy.CarbonFiber.platform.isIOS()) {
            if (window) {
                window.setLeftNavButton(iconView);
            }
            else {
                this.getDraggableView().window
                    .setLeftNavButton(iconView);
            }
        }
        else {
            iconView.setLeft(0);

            this.getWidgetController()
                .getView('navigationBar')
                .add(iconView);
        }
    };

    /**
     * Set the right navigation icon
     *
     * @param {String}  icon         Icon to use
     * @param {Boolean} window       Window to use
     * @param {Object}  subscription Events to subscribe to
     */
    Context.prototype.setRightNavIcon = function (icon, subscription, window) {
        var iconView = this.createNavIcon(icon, subscription, {
            right : Alloy.CarbonFiber.platform.isIOS() ? 0 : null
        });

        if (Alloy.CarbonFiber.platform.isIOS()) {
            if (window) {
                window.setRightNavButton(iconView);
            }
            else {
                this.getDraggableView().window
                    .setRightNavButton(iconView);
            }
        }
        else {
            iconView.setRight(0);

            this.getWidgetController()
                .getView('navigationBar')
                .add(iconView);
        }
    };

    /**
     * Set the title control
     *
     * @param {Ti.UI.View} view View to set
     */
    Context.prototype.setTitleControl = function (view) {
        if (Alloy.CarbonFiber.platform.isIOS()) {
            this.getDraggableView().window
                .setTitleControl(view);
        }
        else {
            this.getWidgetController()
                .getView('navigationBar')
                .add(view);
        }
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
     * Get the wrapper view
     *
     * @return {Ti.UI.View}  Carbon's draggable view
     */
    Context.prototype.getWrapperView = function () {
        return this.getWidgetController().wrapper;
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