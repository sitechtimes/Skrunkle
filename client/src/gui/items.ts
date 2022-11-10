export class PlayerItem {
  public _damage: number
  public _name: string
  public _img: string
  
  constructor(name: string, damage: number, img: string) {
    this._name = name
    this._damage = damage
    this._img = img
  }

  public drop() {
    // call entity generation
  }

  public use() {
    // use thomas' hitbox detection
  }
}

export const Items = {
  hammer: new PlayerItem("Hammer", 5, "img-link"),
  shovel: new PlayerItem("Shovel", 10, "img-link"),
  dagger: new PlayerItem("Dagger", 35, "img-link")
}