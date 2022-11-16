import type { Player } from "../entity/player"

export class PlayerItem {
  public _name: string
  public _type: "Damage"|"Heal"|"Utility"
  public _magnitude: number
  public _img: string
  private _player: Player
  
  constructor(
    item:Item,
    player: Player
  ) {
    this._name = item.name
    this._type = item.type
    this._magnitude = item.magnitude
    this._img = item.img
    this._player = player
  }

  public drop() {
    // call entity generation
  }

  public use() {
    switch (this._type) {
      case "Damage":
        // use thomas' hitbox detection
        break
      case "Heal":
        
        break
      case "Utility":
        // not sure what this means yet
        break
    }
  }
}

/* export const Items = {
  hammer: new PlayerItem("Hammer", "Damage", 5, "img-link"),
  spork: new PlayerItem("Spork", "Damage", 7, "img-link"),
  shovel: new PlayerItem("Shovel", "Damage", 10, "img-link"),
  dagger: new PlayerItem("Dagger", "Damage", 35, "img-link"),
  skillet: new PlayerItem("Cast Iron Skillet", "Damage", 10, "img-link"),
  bandage: new PlayerItem("Bandage", "Heal", 0, "img-link"),
  rope: new PlayerItem("Rope", "Utility", 50, "img-link")
} */

export const Items = {
  hammer: { name: "Hammer", type: "Damage", magnitude: 5, img: "img-link"},
  spork: { name: "Spork", type: "Damage", magnitude: 7, img: "img-link"},
  shovel: { name: "Shovel", type: "Damage", magnitude: 10, img: "img-link"},
  dagger: { name: "Dagger", type: "Damage", magnitude: 35, img: "img-link"},
  skillet: { name: "Cast Iron Skillet", type: "Damage", magnitude: 10, img: "img-link"},
  bandage: { name: "Bandage", type: "Heal", magnitude: 0, img: "img-link"},
  rope: { name: "Rope", type: "Utility", magnitude: 50, img: "img-link"},
}

interface Item {
  name: string,
  type: "Damage"|"Heal"|"Utility",
  magnitude: number,
  img: string
}