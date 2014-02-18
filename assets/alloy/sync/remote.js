(function () {
    'use strict';

    exports = module.exports = {

        /**
         * Number of spaces to indent
         * debug messages
         *
         * @type {Number}
         */
        indentLog : 4,

        /**
         * Override for Backbone's `sync` method
         *
         * @param  {String} method
         * @param  {Model} model
         * @param  {Object} options
         * @return undefined
         */
        sync : function (method, model, options) {
            if (! _.has(_, 'str')) {
                throw 'Sync adapter [remote] requires the Underscore.String extension.';
            }

            Alloy.CarbonFiber.log('Remote - Preparing request...', this.indentLog);

            var verbs = {
                create : 'POST',
                read : 'GET',
                update : 'PUT',
                'delete' : 'DELETE'
            };

            this.debugging = model.config.debug || options.debug || false;
            this.url = model.config.url;
            this.endpoint = model.config.endpoint;
            this.options = _.defaults(options, {

                /**
                 * Default request timeout
                 *
                 * @type {Number}
                 */
                timeout : 8000,

                /**
                 * Query string parameters
                 *
                 * @type {Object}
                 */
                query : {},

                /**
                 * Custom URL string suffixes
                 *
                 * @type {Array}
                 */
                appends : [],

                /**
                 * Request post properties
                 *
                 * @type {Object}
                 */
                post : {},

                /**
                 * Request header
                 *
                 * @type {Object}
                 */
                headers : {}

            });

            if (method === 'create' || method === 'update') {
                this.options.post = _.extend(this.options.post, model.toJSON());

                // Shim Backbone's ability to emulate
                // HTTP requests for servers that don't
                // support "PUT"

                if (Alloy.Backbone.emulateHTTP) {
                    Alloy.CarbonFiber.log('Remote - HTTP emulation is active, setting proper headers and parameters.', this.indentLog);

                    if (! _.has(this.options.headers, 'X-HTTP-Method-Override')) {
                        this.options.post._method = verbs[method];
                        method = 'create';

                        this.options.headers['X-HTTP-Method-Override'] = 'POST';
                    }
                }
            }

            if (! _.has(this.options.headers, 'Content-Type')) {
                this.options.headers['Content-Type'] = 'application/json';
            }

            this.request(model, verbs[method]);
        },

        /**
         * Make the request to the remote server
         *
         * @param  {Model} model
         * @param  {String} method
         * @return undefined
         */
        request : function (model, method) {
            var self = this,
                url = this.getUrl(model),
                xhr = Ti.Network.createHTTPClient({

                    /**
                     * TTL for request
                     *
                     * @type {Number}
                     */
                    timeout : this.options.timeout,

                    /**
                     * Success
                     *
                     * @return undefined
                     */
                    onload : function () {
                        var resp;

                        resp = JSON.parse(this.responseText);

                        Alloy.CarbonFiber.log('Remote - Request [' + xhr.status + '] => ' + _.str.truncate(xhr.responseText, 100), self.indentLog);

                        model[model instanceof Backbone.Collection ? 'reset' : 'set'](model.parse(resp, xhr), self.options);

                        model.trigger('fetch', model);
                        self.options.success();
                    },

                    /**
                     * Error
                     *
                     * @param  {Event} errorEvent
                     * @return undefined
                     */
                    onerror : function (errorEvent) {
                        Alloy.CarbonFiber.log('Remote - Request did not complete successfully (' + xhr.status + ').', self.indentLog);
                        Alloy.CarbonFiber.log('Remote - There was a problem fetching collection [' + errorEvent.error + '].', self.indentLog);

                        model.trigger('error');
                        self.options.error();
                    }

                });

            // If we are sending along any
            // custom headers make sure that
            // they are properly set on the
            // XHR

            if (_.isObject(this.options.headers) && _.size(this.options.headers) > 0) {
                _.each(this.options.headers, function (headerValue, headerKey) {
                    Alloy.CarbonFiber.log('Remote - Setting header: ' + headerKey + ' => ' + headerValue, this.indentLog);

                    xhr.setRequestHeader(headerKey, headerValue);
                }, this);
            }

            Alloy.CarbonFiber.log('Remote - Opening client for URL (' + url + ').', this.indentLog);

            xhr.open(method, url);

            if ((method === 'POST' || method === 'PUT') && ! _.isObject(this.options.post)) {
                throw 'Supplied post must be an object.';
            }
            else if (_.size(this.options.post) > 0) {
                Alloy.CarbonFiber.log('Remote - Sending request with parameters: \n' + JSON.stringify(this.options.post), this.indentLog);
            }
            else {
                Alloy.CarbonFiber.log('Remote - Sending request...', this.indentLog);
            }

            xhr.send(this.options.post || undefined);
        },

        /**
         * Build and return the query string
         *
         * @return {String}
         */
        getQueryString : function () {
            var parts = [];

            if (_.isObject(this.options.query)) {
                _.each(this.options.query, function (value, key) {

                    // Each part of the query string
                    // must be encoded before being pushed
                    // as a valid "part"

                    parts.push(
                        Ti.Network.encodeURIComponent(_.str.trim(key, '?&')) + '=' +
                        Ti.Network.encodeURIComponent(_.isObject(value) ? JSON.stringify(value) : value)
                    );
                });
            }
            else {
                throw 'Supplied query must be an object.';
            }

            return parts ? '?' + parts.join('&') : '';
        },

        /**
         * Build and return the URL
         *
         * @param  {Model} model
         * @return undefined
         */
        getUrl : function (model) {
            var url = _.str.rtrim(this.url || Alloy.Globals.API_URL, '/'),
                appends = [];

            if (! url) {
                throw 'A URL has not been set.';
            }

            if (model instanceof Backbone.Model && model.idAttribute) {
                appends.push(this.options[model.idAttribute]);
            }

            appends = _.without(appends.concat(this.options.appends), null, undefined);
            appends = appends.length ? '/' + _.str.trim(appends.join('/'), '/') : '';

            return _.str.sprintf('%s/%s%s', url, this.endpoint + appends, this.getQueryString());
        }
    };
}).call(this);