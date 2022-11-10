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
        this.tempid = "";
        this._engine = new babylonjs_1.NullEngine();
        this._scene = new babylonjs_1.Scene(this._engine);
        this._entities.push(babylonjs_1.MeshBuilder.CreateBox("box", { size: 2, height: 2, width: 2 }, this._scene));
        this._ground = babylonjs_1.MeshBuilder.CreatePlane("ground", { width: 500, height: 500 }, this._scene);
        this._ground.rotation = new babylonjs_1.Vector3(Math.PI / 2, 0, 0);
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
        this._scene.enablePhysics(new babylonjs_1.Vector3(0, -1, 0), new babylonjs_1.CannonJSPlugin(true, 10, cannon));
        this._scene.executeWhenReady(function () {
            _this.logger.progress("Scene is ready, running server side simulation");
            _this._engine.runRenderLoop(function () {
                _this._scene.render();
                _this._ticks_elapsed++;
                if (_this.tempid != "")
                    console.log(_this.players.get(_this.tempid).position);
            });
        });
        this.logger.interval_logger(this._tick_time, function () {
            _this.logger.progress("Avg Server tick (".concat(_this._tick_time, " ms): ").concat(_this._get_tick));
        });
    };
    World.prototype.add_players = function (id) {
        var playerMesh = babylonjs_1.MeshBuilder.CreateBox(id, { size: 2, width: 2, height: 4 }, this._scene);
        playerMesh.position = new babylonjs_1.Vector3(100, 100, 100);
        playerMesh.physicsImposter = new babylonjs_1.PhysicsImpostor(playerMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 15 }, this._scene);
        this.players.set(id, playerMesh);
        this.tempid = id;
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
    return World;
}());
exports.World = World;
