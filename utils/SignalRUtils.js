class SignalRHub {

    constructor(hubName, options) {
        this.globalConnections = [];
        this.options = options;
        let Hub = this;
        this.connection = null;
        if (options && options.rootPath) {
            this.connection = $.hubConnection(options.rootPath, {useDefaultPath: false});

        }
        else {
            this.connection = $.hubConnection();
        }


        this.proxy = this.connection.createHubProxy(hubName);
        if (options && options.listeners) {
            Object.getOwnPropertyNames(options.listeners)
                .filter(function (propName) {
                    return typeof options.listeners[propName] === 'function';
                })
                .forEach(function (propName) {
                    Hub.on(propName, options.listeners[propName]);
                });
        }
        if (options && options.methods) {
            options.methods.forEach(function (method) {
                Hub[method] = function () {
                    var args = $.makeArray(arguments);
                    args.unshift(method);
                    return Hub.invoke.apply(Hub, args);
                };
            });
        }

        this.connection.qs = {'access_token': localStorage.token};

        if (options && options.errorHandler) {
            this.connection.error(options.errorHandler);
        }
        if (options && options.stateChanged) {
            Hub.connection.stateChanged(options.stateChanged);
        }


    }

    initNewConnection(options) {
        var connection = null;
        if (options && options.rootPath) {
            connection = $.hubConnection(options.rootPath, {useDefaultPath: false});
        } else {
            connection = $.hubConnection();
        }

        connection.logging = (options && options.logging ? true : false);
        return connection;
    }

    getConnection(options) {
        var useSharedConnection = !(this.options && this.options.useSharedConnection === false);
        if (useSharedConnection) {
            return typeof this.globalConnections[this.options.rootPath] === 'undefined' ?
                this.globalConnections[this.options.rootPath] = this.initNewConnection(options) :
                this.globalConnections[this.options.rootPath];
        }
        else {
            return this.initNewConnection(this.options);
        }
    }

    on(event, fn) {
        this.proxy.on(event, fn);
    }

    invoke(method, args) {
        return this.proxy.invoke.apply(this.proxy, arguments)
    }

    disconnect() {
        this.connection.stop();
    }
    getState(){
        return this.connection.state;
    }

    connect() {
        return this.connection.start(this.options.transport ? {transport: this.options.transprots} : null);
    }

}


module.exports = SignalRHub;