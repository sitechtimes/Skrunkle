import { World } from "./world/world"
const world = new World(<HTMLCanvasElement> document.getElementById("renderCanvas"))

world.init()