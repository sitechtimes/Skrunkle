export class PlayerItem {
  public _damage: number
  public _name: string
  
  constructor(name: string, damage: number) {
    this._name = name
    this._damage = damage
  }
}

export const Items = {
  hammer: new PlayerItem("Hammer", 5),
  shovel: new PlayerItem("Shovel", 10),
  dagger: new PlayerItem("Dagger", 35)
}