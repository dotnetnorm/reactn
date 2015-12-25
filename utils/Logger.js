class Logger {
    Log(message, args) {
        if (args != undefined) {
            console.log('%c' + message, 'color: black;font-weight:bold', args);
        }
        else {
            console.log('%c' + message, 'color: black');
        }


    }

    Error(message, args) {
        if (args != undefined) {
            console.error('%c' + message, 'color: red,font-weight:bold', args);
        }
        console.error('%c' + message, 'color: red');
    }

    Info(message, args) {
        console.info('%c' + message, 'color: #bada55', args);

    }

    Warn(message, args) {
        console.warn('%c' + message, 'color: orange', args);
    }
}
var _logger = new Logger();
module.exports = _logger;