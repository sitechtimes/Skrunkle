import { World } from "./world"
import { Logger } from "./logger"
import { SocketServer } from "./server"

let logger: Logger = new Logger("Main")

logger.progress("Starting Backend Server for Multiplayer BabylonDemo")

// const world: World = new World()
// world.init();

const socket: SocketServer = new SocketServer()