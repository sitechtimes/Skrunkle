export class PlayerItem {
  public _name: string;
  public _metadata: string;
  public _type: "Damage" | "Heal" | "Utility";
  public _range?: number;
  public _magnitude: number;
  public _path: string;

  constructor(item: Item) {
    this._name = `(ITEM)-${item.name}-${Math.random() * 100000}`;
    this._metadata = item.name;
    this._type = item.type;
    this._range = item.range;
    this._magnitude = item.magnitude;
    this._path = item.path;
  }
}

export const Items = {
  hammer: <Item>{
    name: "Hammer",
    type: "Damage",
    magnitude: 5,
    path: "path-link",
    range: 7,
  },
  spork: <Item>{
    name: "Spork",
    type: "Damage",
    magnitude: 7,
    path: "spork.glb",
    range: 4,
  },
  spoon: <Item>{
    name: "Spoon",
    type: "Damage",
    magnitude: 3,
    path: "spoon.babylon",
  },
  shovel: <Item>{
    name: "Shovel",
    type: "Damage",
    magnitude: 10,
    path: "path-link",
    range: 10,
  },
  sword: <Item>{
    name: "Sword",
    type: "Damage",
    magnitude: 15,
    path: "sword.glb",
    range: 14,
  },
  dagger: <Item>{
    name: "Dagger",
    type: "Damage",
    magnitude: 35,
    path: "path-link",
    range: 3,
  },
  skillet: <Item>{
    name: "Cast Iron Skillet",
    type: "Damage",
    magnitude: 10,
    path: "path-link",
    range: 5,
  },
  bandage: <Item>{
    name: "Bandage",
    type: "Heal",
    magnitude: 33,
    path: "path-link",
  },
  medkit: <Item>{
    name: "Medkit",
    type: "Heal",
    magnitude: 100,
    path: "path-link",
  },
  slingshot: <Item>{
    name: "Slingshot",
    type: "Damage",
    magnitude: 15,
    path: "slingshot.glb",
    range: 25,
  },
  rope: <Item>{
    name: "Rope",
    type: "Utility",
    magnitude: 50,
    path: "path-link",
  },
};

export interface Item {
  name: string;
  type: "Damage" | "Heal" | "Utility";
  magnitude: number;
  path: string;
  range?: number;
}
