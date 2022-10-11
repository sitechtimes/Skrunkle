"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var Router;
(function (Router) {
    var messageMap = {
        "player_interaction": recieveInteraction,
        "init_game_state": initPlayer,
        "ping": sendPong
    };
    function routeMessage(msg, client, playerId) {
        if (messageMap[msg.type] !== undefined) {
            messageMap[msg.type](msg.msg, playerId, client, msg.origin, msg.id);
        }
    }
    Router.routeMessage = routeMessage;
    function recieveInteraction(data, playerId) {
        // world.applyMovement
    }
    function sendPong() { }
    function initPlayer() {
    }
})(Router = exports.Router || (exports.Router = {}));
