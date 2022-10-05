"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
var ws_1 = require("ws");
var world_1 = require("./world");
var player_1 = require("./entity/player");
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
    SocketServer.prototype.setPlayer = function (client, player) {
        this.players.set(client, player);
    };
    SocketServer.prototype.listen = function () {
        var _this = this;
        this.logger.progress('Start listening on port: ' + SocketServer.PORT);
        this.server.on('connection', function (client) {
            // save client
            _this.logger.log('Client connected');
            if (!_this.players.has(client)) {
                _this.setPlayer(client, new player_1.Player());
                client.send(JSON.stringify({
                    player: _this.players.get(client),
                    players: _this.players.size
                }));
            }
            // basic starter functiosn
            client.on('message', function (message) {
                if (_this.players.has(client)) {
                    var playerId = _this.players.get(client);
                    var msg = JSON.parse(message);
                    // do something in router
                }
            });
            client.on('close', function () {
                _this.logger.log('Client connection closed');
                var id = _this.players.get(client);
                // this.world.removePlayer(id)
                _this.players.delete(client);
                // close with router
            });
            client.on('error', function () {
                _this.logger.error('Client connection threw an error');
            });
        });
    };
    SocketServer.prototype.broadCast = function (data) {
        var _this = this;
        this.server.clients.forEach(function (client) {
            if (_this.players.get(client) !== null) {
                client.send(data);
            }
        });
    };
    SocketServer.PORT = 2000;
    return SocketServer;
}());
exports.SocketServer = SocketServer;
