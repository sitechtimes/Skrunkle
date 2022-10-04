"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var world_1 = require("./world");
var logger_1 = require("./logger");
var logger = new logger_1.Logger("Main");
logger.progress("Starting Backend Server for Multiplayer BabylonDemo");
var world = new world_1.World();
world.init();
