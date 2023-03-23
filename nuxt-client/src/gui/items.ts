import { Packet, PacketType } from "../packet";
import type { MainPlayer } from "../entity/mainPlayer";
import type { Socket } from "../socket";
import type { Hotbar } from "./hotbar";

export class PlayerItem {
  public _name: string;
  public _metadata: string;
  public _type: "Damage" | "Heal" | "Utility";
  public _range?: number;
  public _magnitude: number;
  public _path: string;
  public _item: Item
  /* the hashtag means private */
  #_player: MainPlayer;
  #_hotbar: Hotbar;
  #_socket: Socket;

  constructor(item: Item, player: MainPlayer, hotbar: Hotbar, socket: Socket) {
    this._name = `(ITEM)-${item.name}-${Math.random() * 100000}`;
    this._item = item
    this._metadata = item.name;
    this._type = item.type;
    this._range = item.range;
    this._magnitude = item.magnitude;
    this._path = item.path;
    this.#_player = player;
    this.#_hotbar = hotbar;
    this.#_socket = socket;
  }

  public drop() {
    // call entity generation
  }

  public use(id: any) {
    console.log("item used");
    switch (this._type) {
      case "Damage":
        this.#_socket.send(
          new Packet(
            PacketType.interaction,
            [
              {
                id: this.#_player.id,
                target: id,
                type: this._type,
                magnitude: this._magnitude,
              },
            ],
            this.#_player.id
          )
        );
        break;
      case "Heal":
        this.#_player.heal(this._magnitude);
        this.#_hotbar.healthChange(this.#_player.health);
        this.#_socket.send(
          new Packet(
            PacketType.interaction,
            [
              {
                id: this.#_player.id,
                target: this.#_player.id,
                type: this._type,
                magnitude: this._magnitude,
              },
            ],
            this.#_player.id
          )
        );
        break;
      case "Utility":
        // not sure what this means yet
        break;
      default:
        console.log("Unexpected item type");
        break;
    }
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
