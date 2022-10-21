"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
var ws_1 = require("ws");
var world_1 = require("./world");
var player_1 = require("./entity/player");
var babylonjs_1 = require("babylonjs");
var packet_1 = require("./packet");
var logger_1 = require("./logger");
var SocketServer = /** @class */ (function () {
    function SocketServer() {
        this.players = new Map();
        this.world = new world_1.World();
        this.logger = new logger_1.Logger('Socket');
        this.server = new ws_1.Server({ port: SocketServer.PORT });
        this.init();
        this.listen();
    }
    SocketServer.prototype.init = function () {
        this.world.init();
    };
    SocketServer.prototype.setPlayer = function (uid, player) {
        this.players.set(uid, player);
    };
    SocketServer.prototype.listen = function () {
        var _this = this;
        this.logger.progress('Start listening on port: ' + SocketServer.PORT);
        this.server.on('connection', function (client) {
            // save client
            _this.logger.log('Client connected');
            if (!_this.players.has(client)) {
                var player = new player_1.Player();
                _this.players.set(player.id, player);
                _this.send(client, new packet_1.Packet(packet_1.PacketType.info, [{
                        player: player,
                        players: _this.players.size
                    }]));
            }
            // basic starter functiosn
            client.on('message', function (message) {
                var msg = JSON.parse(message);
                if (_this.players.has(msg.uid)) {
                    var player = _this.players.get(msg.uid);
                    switch (msg.type) {
                        case "Movement":
                            // this.logger.log(`Received Movement from client ${msg.payload[0].id}`)
                            // player.position = new Vector3(msg.payload.position.x, msg.payload.position.y, msg.payload.position.z)
                            // this.send(client, new Packet(PacketType.update, [player]))
                            if (player !== null) {
                                player.position = new babylonjs_1.Vector3(msg.payload[0].position.x, msg.payload[0].position.y, msg.payload[0].position.z);
                                _this.broadCast(new packet_1.Packet(packet_1.PacketType.update, msg.payload[0]));
                            }
                            // console.log(msg.payload[0].position)
                            break;
                        case "Info":
                            _this.setPlayer(msg.uid, msg.payload[0]);
                            _this.broadCast(new packet_1.Packet(packet_1.PacketType.info, msg.payload[0]));
                            break;
                        case "Close":
                            _this.players.delete(msg.uid);
                            _this.broadCast(new packet_1.Packet(packet_1.PacketType.close, [{ id: msg.uid, delete: true }]));
                            break;
                        case "ping":
                            _this.logger.log("Received Ping from client. Pong!");
                            _this.send(client, new packet_1.Packet(packet_1.PacketType.info, ['Pong!']));
                        default:
                            _this.logger.error("Unknown socket message from client (".concat(msg.type, ")"));
                            break;
                    }
                }
            });
            client.on('close', function () {
                _this.logger.log('Client connection closed');
                // this.world.removePlayer(id)
                // close with router
            });
            client.on('error', function () {
                _this.logger.error('Client connection threw an error');
            });
        });
    };
    SocketServer.prototype.send = function (client, packet) {
        client.send(JSON.stringify(packet));
    };
    SocketServer.prototype.broadCast = function (packet) {
        var _this = this;
        this.server.clients.forEach(function (user) {
            if (_this.players.get(user) !== null) {
                _this.send(user, packet);
            }
        });
    };
    SocketServer.PORT = 2000;
    return SocketServer;
}());
exports.SocketServer = SocketServer;
