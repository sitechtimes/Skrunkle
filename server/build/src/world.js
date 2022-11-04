"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var babylonjs_1 = require("babylonjs");
var logger_1 = require("./logger");
var World = /** @class */ (function () {
    function World() {
        this._tick_time = 5000; // in ms
        this._ticks_elapsed = 0;
        this._entities = [];
        this.logger = new logger_1.Logger('World');
        this.worldSize = { top: new babylonjs_1.Vector3(50, 50, 50), bottom: new babylonjs_1.Vector3(-50, 0, -50) };
        this._engine = new babylonjs_1.NullEngine();
        this._scene = new babylonjs_1.Scene(this._engine);
        this._entities.push(babylonjs_1.MeshBuilder.CreateBox("box", { size: 2, height: 2, width: 2 }, this._scene));
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
    World.prototype.validateEntityPosition = function (entityPosition) {
        if ((entityPosition.x < this.worldSize.bottom.x || entityPosition.x > this.worldSize.top.x) ||
            (entityPosition.y < this.worldSize.bottom.y || entityPosition.y > this.worldSize.top.y) ||
            (entityPosition.z < this.worldSize.bottom.z || entityPosition.z > this.worldSize.top.z)) {
            console.log("EXCEEDED LIMITS: " + entityPosition + " compared to " + this.worldSize.bottom + " and " + this.worldSize.top);
            return new babylonjs_1.Vector3(0, 10, 0);
        }
        else
            return entityPosition;
    };
    World.prototype.init = function () {
        var _this = this;
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        var camera = new babylonjs_1.ArcRotateCamera("Camera", 0, 0.8, 100, babylonjs_1.Vector3.Zero(), this._scene);
        // this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, cannon));
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
    Object.defineProperty(World.prototype, "entities", {
        get: function () {
            return this._entities.map(function (entity) {
                return { name: entity.name, position: entity.position };
            });
        },
        enumerable: false,
        configurable: true
    });
    return World;
}());
exports.World = World;
