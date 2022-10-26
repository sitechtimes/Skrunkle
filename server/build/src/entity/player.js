"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var babylonjs_1 = require("babylonjs");
var uuid_1 = require("uuid");
var unique_username_generator_1 = require("unique-username-generator");
var Player = /** @class */ (function () {
    /*  private _scene: Scene;
     private _body: Mesh | null = null */
    function Player(name, health, exp, position, id) {
        this._name = name || (0, unique_username_generator_1.generateUsername)();
        this._health = health || 100;
        this._exp = exp || 0;
        this._position = position || new babylonjs_1.Vector3(0, 0, 0);
        this._id = (0, uuid_1.v4)();
        /*    if (position) {
               this._position = position
           }
           
           if (scene) {
               this._scene = scene
   
               if (options.renderBody) {
                   this._body = MeshBuilder.CreateBox("playerBody", { size: 5, width: 5, height: 7}, this._scene)
           
                   this._body.physicsImpostor = new PhysicsImpostor(this._body, PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.01, restitution: 0.3 })
               }
           } */
    }
    Object.defineProperty(Player.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (new_position) {
            this._position = new_position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (new_name) {
            this._name = new_name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "health", {
        get: function () {
            return this._health;
        },
        set: function (new_health) {
            if (new_health < 0 || new_health > 100) {
                throw new Error("Player entity health out of bound");
            }
            this._health = new_health;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "exp", {
        get: function () {
            return this._exp;
        },
        set: function (new_exp) {
            this._exp = new_exp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    return Player;
}());
exports.Player = Player;
