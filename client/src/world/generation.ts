import { World } from "./world";
import { Items, PlayerItem } from "../gui/items"



export class Generation {
  private _world: World
  
  constructor(world: World) {
    this._world = world
  }

  public generateTrees() {}

  public generateItems() {}
}