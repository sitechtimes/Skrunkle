"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
var server_1 = require("./server");
var logger = new logger_1.Logger("Main");
logger.progress("Starting Backend Server for Multiplayer BabylonDemo");
// const world: World = new World()
// world.init();
var socket = new server_1.SocketServer();
