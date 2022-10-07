"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
var uuid_1 = require("uuid");
var Item = /** @class */ (function () {
    function Item(name, position, amount) {
        this._name = name;
        this._position = position;
        this._amount = amount;
        this._id = (0, uuid_1.v4)();
    }
    Object.defineProperty(Item.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (new_position) {
            this._position = new_position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (new_name) {
            this._name = new_name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        set: function (new_amount) {
            this._amount = new_amount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    return Item;
}());
exports.Item = Item;
