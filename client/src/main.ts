import { World } from "./world/world"
import { GUI } from "./gui/gui"

const world = new World(<HTMLCanvasElement> document.getElementById("renderCanvas"))
const gui = new GUI()

world.init()
gui.createMenu()