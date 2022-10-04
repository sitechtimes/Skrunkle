import { World } from "./world"
import { Logger } from "./logger"

let logger: Logger = new Logger("Main")

logger.progress("Starting Backend Server for Multiplayer BabylonDemo")

const world: World = new World()
world.init();