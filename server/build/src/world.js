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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
var babylonjs_1 = require("babylonjs");
var logger_1 = require("./logger");
var entities_1 = require("./entity/entities");
var cannon = __importStar(require("cannon-es"));
var packet_1 = require("./packet");
var player_1 = require("./entity/player");
var World = /** @class */ (function () {
    function World(socket) {
        this._tick_time = 5000; // in ms
        this._ticks_elapsed = 0;
        this._entities = new Map();
        this.logger = new logger_1.Logger('World');
        this.worldSize = { top: new babylonjs_1.Vector3(50, 50, 50), bottom: new babylonjs_1.Vector3(-50, 0, -50) };
        this.players = new Map();
        this._engine = new babylonjs_1.NullEngine();
        this._scene = new babylonjs_1.Scene(this._engine);
        this._socket = socket;
        this._scene.enablePhysics(new babylonjs_1.Vector3(0, -9.81, 0), new babylonjs_1.CannonJSPlugin(true, 10, cannon));
        this._ground = babylonjs_1.MeshBuilder.CreateGround("ground", { width: 1000, height: 1000 }, this._scene);
        // this._ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        this._ground.physicsImpostor = new babylonjs_1.PhysicsImpostor(this._ground, babylonjs_1.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene);
        for (var x = 0; x < 5; x++) {
            for (var z = 0; z < 5; z++) {
                var box = babylonjs_1.MeshBuilder.CreateBox("box", { size: 7 }, this._scene);
                box.physicsImpostor = new babylonjs_1.PhysicsImpostor(box, babylonjs_1.PhysicsImpostor.BoxImpostor, { mass: 90, restitution: 0, friction: 5 }, this._scene);
                box.physicsImpostor.setAngularVelocity(new babylonjs_1.Quaternion(x, 0, z, 1));
                var temp = new entities_1.Entities("Box test", new babylonjs_1.Vector3(x * 10, 100, z * 10), box);
                this._entities.set("M-".concat(temp.id), temp);
            }
        }
        // this._entities.
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
            // console.log("EXCEEDED LIMITS: " + entityPosition + " compared to " +  this.worldSize.bottom + " and " + this.worldSize.top)
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
                // if (Array.from(this.players.keys()).length > 0) {
                //     let id: string = Array.from(this.players.keys())[0]
                //     let p: Player = this.players.get(id)
                //     console.log(`${id}: ${p.body}`)
                // }
                _this._updateEntities();
            });
        });
        this.logger.interval_logger(this._tick_time, function () {
            _this.logger.progress("Avg Server tick (".concat(_this._tick_time, " ms): ").concat(_this._get_tick));
        });
    };
    World.prototype._updateEntities = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this._entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                var updatePacket = new packet_1.Packet(packet_1.PacketType.update, [{ position: value.position, linearVelocity: value.object.physicsImpostor.getLinearVelocity(), angularVelocity: value.object.physicsImpostor.getAngularVelocity() }], key);
                // let updatePacket: Packet = new Packet(PacketType.update, [{position: value.position, linearVelocity: new Vector3(1, 1, 1), angularVelocity: new Vector3(1, 1, 1)}], key)
                this._socket.broadCast(updatePacket);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    World.prototype.add_players = function (id) {
        var playerMesh = babylonjs_1.MeshBuilder.CreateBox(id, { size: 3, width: 3, height: 4 }, this._scene);
        var physicsImposter = new babylonjs_1.PhysicsImpostor(playerMesh, babylonjs_1.PhysicsImpostor.BoxImpostor, { mass: 90, restitution: 1 }, this._scene);
        var player = new player_1.Player(playerMesh, physicsImposter, "player.name", 100, 100, new babylonjs_1.Vector3(0, 0, 0), id);
        this.players.set(id, player);
        return player;
    };
    World.prototype.update_player = function (id, value) {
        this.players.set(id, value);
    };
    World.prototype.delete_player = function (id) {
        this.players.delete(id);
    };
    World.prototype._array_entities = function () {
        var e_2, _a;
        var data = [];
        try {
            for (var _b = __values(this._entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                data.push({ position: value.position });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return data;
    };
    World.prototype.move_player = function (id, change_vector) {
        var scale = 0.5;
        var playerMesh = this.players.get(id);
        playerMesh.position.x += change_vector._x * scale;
        playerMesh.position.y += change_vector._y * scale;
        playerMesh.position.z += change_vector._z * scale;
    };
    return World;
}());
exports.World = World;
