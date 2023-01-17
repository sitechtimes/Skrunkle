"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
var ws_1 = require("ws");
var world_1 = require("./world");
var babylonjs_1 = require("babylonjs");
var packet_1 = require("./packet");
var logger_1 = require("./logger");
var SocketServer = /** @class */ (function () {
    function SocketServer() {
        this.world = new world_1.World(this);
        this.logger = new logger_1.Logger('Socket');
        this.server = new ws_1.Server({ port: SocketServer.PORT });
        this.init();
        this.listen();
    }
    SocketServer.prototype.init = function () {
        this.world.init();
    };
    SocketServer.prototype.setPlayer = function (uid, player) {
        this.world.players.set(uid, player);
    };
    SocketServer.prototype.listen = function () {
        var _this = this;
        this.logger.progress('Start listening on port: ' + SocketServer.PORT);
        this.server.on('connection', function (client) {
            // save client
            _this.logger.log('Client connected');
            if (!_this.world.players.has(client)) {
                var playerid = uuidv4();
                var player = _this.world.add_players(playerid);
                _this.send(client, new packet_1.Packet(packet_1.PacketType.info, [{
                        player: player.serialize(),
                        players: _this.world.players.size
                    }], player.id));
                _this.send(client, new packet_1.Packet(packet_1.PacketType.mesh, _this.world._array_entities()));
            }
            // basic starter functiosn
            client.on('message', function (message) {
                var msg = JSON.parse(message);
                if (_this.world.players.has(msg.uid)) {
                    var player = _this.world.players.get(msg.uid);
                    switch (msg.type) {
                        case "Movement":
                            // this.logger.log(`Received Movement from client ${msg.payload[0].id}`)
                            // player.position = new Vector3(msg.payload.position.x, msg.payload.position.y, msg.payload.position.z)
                            // this.send(client, new Packet(PacketType.update, [player]))
                            if (player !== null) {
                                player.position = _this.world.validateEntityPosition(new babylonjs_1.Vector3(msg.payload[0].position._x, msg.payload[0].position._y, msg.payload[0].position._z));
                                msg.payload[0].position = player.position;
                                _this.world.update_player(msg.uid, player);
                                var updatePacket = new packet_1.Packet(packet_1.PacketType.update, msg.payload[0], player.id);
                                updatePacket.uid = msg.uid;
                                _this.broadCast(updatePacket);
                            }
                            break;
                        case "Impulse":
                            _this.world.move_player(msg.uid, msg.payload[0].impulse);
                            break;
                        case "Info":
                            _this.setPlayer(msg.uid, msg.payload[0]);
                            _this.broadCast(new packet_1.Packet(packet_1.PacketType.info, msg.payload[0]));
                            break;
                        case "Close":
                            _this.world.players.delete(msg.uid);
                            _this.world.players.delete(msg.uid);
                            _this.broadCast(new packet_1.Packet(packet_1.PacketType.close, [{ id: msg.uid, delete: true }]));
                            break;
                        case "Interaction":
                            _this.logger.log("Received interaction");
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
            if (_this.world.players.get(user) !== null) {
                _this.send(user, packet);
            }
        });
        this.world.onSocketData(packet);
    };
    SocketServer.PORT = 2000;
    return SocketServer;
}());
exports.SocketServer = SocketServer;
