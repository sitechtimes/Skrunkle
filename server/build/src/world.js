"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var babylonjs_1 = require("babylonjs");
var logger_1 = require("./logger");
var World = /** @class */ (function () {
    function World() {
        this._tick_time = 5000; // in ms
        this._ticks_elapsed = 0;
        this.logger = new logger_1.Logger('World');
        this._engine = new babylonjs_1.NullEngine();
        this._scene = new babylonjs_1.Scene(this._engine);
        this._players = new Map;
    }
    Object.defineProperty(World.prototype, "_get_tick", {
        get: function () {
            var ticks = Math.round(this._ticks_elapsed / this._tick_time * 1000);
            this._ticks_elapsed = 0;
            return ticks;
        },
        enumerable: false,
        configurable: true
    });
    World.prototype.init = function () {
        var _this = this;
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        var camera = new babylonjs_1.ArcRotateCamera("Camera", 0, 0.8, 100, babylonjs_1.Vector3.Zero(), this._scene);
        this._scene.executeWhenReady(function () {
            _this.logger.progress("Scene is ready, running server side simulation");
            _this._engine.runRenderLoop(function () {
                _this._scene.render();
                _this._ticks_elapsed++;
            });
        });
        this.logger.interval_logger(this._tick_time, function () {
            _this.logger.progress("Avg Server tick (".concat(_this._tick_time, " ms): ").concat(_this._get_tick));
        });
    };
    World.prototype.onSocketData = function (data) {
        switch (data === null || data === void 0 ? void 0 : data.type) {
            case "Update":
                break;
            case "Info":
                break;
            case "Close":
                break;
            default:
                // throw some error
                break;
        }
    };
    return World;
}());
exports.World = World;
