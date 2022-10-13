"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = exports.PacketType = void 0;
var PacketType;
(function (PacketType) {
    PacketType["update"] = "Update";
    PacketType["info"] = "Info";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
var Packet = /** @class */ (function () {
    function Packet(packetType, data) {
        this.type = packetType;
        this.payload = data;
    }
    return Packet;
}());
exports.Packet = Packet;
