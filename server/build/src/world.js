"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var babylonjs_1 = require("babylonjs");
var logger_1 = require("./logger");
var cannon = __importStar(require("cannon-es"));
var World = /** @class */ (function () {
    function World() {
        this._tick_time = 5000; // in ms
        this._ticks_elapsed = 0;
        this._entities = [];
        this.logger = new logger_1.Logger('World');
        this.worldSize = { top: new babylonjs_1.Vector3(50, 50, 50), bottom: new babylonjs_1.Vector3(-50, 0, -50) };
        this.players = new Map();
        this._engine = new babylonjs_1.NullEngine();
        this._scene = new babylonjs_1.Scene(this._engine);
        this._scene.enablePhysics(new babylonjs_1.Vector3(0, -9.81, 0), new babylonjs_1.CannonJSPlugin(true, 10, cannon));
        this._entities.push(babylonjs_1.MeshBuilder.CreateBox("box", { size: 2, height: 2, width: 2 }, this._scene));
        this._ground = babylonjs_1.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this._scene);
        // this._ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        this._ground.physicsImpostor = new babylonjs_1.PhysicsImpostor(this._ground, babylonjs_1.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene);
        // console.log(this._ground.position)
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
        // this._scene.enablePhysics(new Vector3(0, -9.81, 0), new OimoJSPlugin());
        this._scene.executeWhenReady(function () {
            _this.logger.progress("Scene is ready, running server side simulation");
            _this._engine.runRenderLoop(function () {
                _this._scene.render();
                _this._ticks_elapsed++;
                // if (Array.from(this.players.keys()).length > 0) console.log(this.players.get(Array.from(this.players.keys())[0]).position)
            });
        });
        this.logger.interval_logger(this._tick_time, function () {
            _this.logger.progress("Avg Server tick (".concat(_this._tick_time, " ms): ").concat(_this._get_tick));
        });
    };
    World.prototype.add_players = function (id) {
        var playerMesh = babylonjs_1.MeshBuilder.CreateBox(id, { size: 2, width: 2, height: 4 }, this._scene);
        playerMesh.position = new babylonjs_1.Vector3(0, 100, 0);
        playerMesh.physicsImposter = new babylonjs_1.PhysicsImpostor(playerMesh, babylonjs_1.PhysicsImpostor.BoxImpostor, { mass: 90, restitution: 1 }, this._scene);
        this.players.set(id, playerMesh);
    };
    World.prototype.update_player = function (id, value) {
        this.players.set(id, value);
    };
    World.prototype.delete_player = function (id) {
        this.players.delete(id);
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
    World.prototype.apply_impulse_player = function (id, impulse_vector) {
        var scale = 1e3;
        var playerMesh = this.players.get(id);
        var scaledVector = new babylonjs_1.Vector3(impulse_vector._x * scale, impulse_vector._y, impulse_vector._z * scale);
        // y no scale yet
        if (playerMesh) {
            console.log("Applied impulse: { x: ".concat(scaledVector._x, ", y: ").concat(scaledVector._y, ", z: ").concat(scaledVector._z, " }"));
            playerMesh.physicsImposter.applyImpulse(scaledVector, playerMesh.getAbsolutePosition().add(babylonjs_1.Vector3.Zero()));
            this.players.set(id, playerMesh);
        }
    };
    return World;
}());
exports.World = World;
