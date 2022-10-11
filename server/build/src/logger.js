"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var color;
(function (color) {
    color["Reset"] = "\u001B[0m";
    color["Bright"] = "\u001B[1m";
    color["Dim"] = "\u001B[2m";
    color["Underscore"] = "\u001B[4m";
    color["Blink"] = "\u001B[5m";
    color["Reverse"] = "\u001B[7m";
    color["Hidden"] = "\u001B[8m";
    color["FgBlack"] = "\u001B[30m";
    color["FgRed"] = "\u001B[31m";
    color["FgGreen"] = "\u001B[32m";
    color["FgYellow"] = "\u001B[33m";
    color["FgBlue"] = "\u001B[34m";
    color["FgMagenta"] = "\u001B[35m";
    color["FgCyan"] = "\u001B[36m";
    color["FgWhite"] = "\u001B[37m";
    color["BgBlack"] = "\u001B[40m";
    color["BgRed"] = "\u001B[41m";
    color["BgGreen"] = "\u001B[42m";
    color["BgYellow"] = "\u001B[43m";
    color["BgBlue"] = "\u001B[44m";
    color["BgMagenta"] = "\u001B[45m";
    color["BgCyan"] = "\u001B[46m";
    color["BgWhite"] = "\u001B[47m";
})(color || (color = {}));
var Logger = /** @class */ (function () {
    function Logger(section) {
        this._section = section;
    }
    Logger.prototype._gettime = function () {
        var time = new Date();
        return "".concat(time.toLocaleDateString(), " ").concat(time.toLocaleTimeString('en-GB'));
    };
    Logger.prototype.log = function (message) {
        console.log("".concat(color.BgCyan, "[").concat(this._gettime(), "]").concat(color.Reset, " ").concat(color.FgMagenta, "[").concat(this._section, "]: ").concat(color.Reset).concat(message).concat(color.Reset));
    };
    Logger.prototype.warn = function (message) {
        console.log("".concat(color.BgCyan, "[").concat(this._gettime(), "]").concat(color.Reset, " ").concat(color.FgMagenta, "[").concat(this._section, "]: ").concat(color.FgYellow).concat(message).concat(color.Reset));
    };
    Logger.prototype.error = function (message) {
        console.log("".concat(color.BgCyan, "[").concat(this._gettime(), "]").concat(color.Reset, " ").concat(color.FgMagenta, "[").concat(this._section, "]: ").concat(color.FgRed).concat(message).concat(color.Reset));
    };
    Logger.prototype.pass = function (message) {
        console.log("".concat(color.BgCyan, "[").concat(this._gettime(), "]").concat(color.Reset, " ").concat(color.FgMagenta, "[").concat(this._section, "]: ").concat(color.FgGreen).concat(message).concat(color.Reset));
    };
    Logger.prototype.progress = function (message) {
        console.log("".concat(color.BgCyan, "[").concat(this._gettime(), "]").concat(color.Reset, " ").concat(color.FgMagenta, "[").concat(this._section, "]: ").concat(color.FgCyan).concat(message).concat(color.Reset));
    };
    Logger.prototype.interval_logger = function (ms, callback) {
        var recursion = function () {
            callback();
            setTimeout(recursion, ms);
        };
        setTimeout(recursion, ms);
    };
    return Logger;
}());
exports.Logger = Logger;
