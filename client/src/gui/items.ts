import type { MainPlayer } from "../entity/mainPlayer"
import type { Player } from "../entity/player"
import { Packet, PacketType } from "../packet"
import type { Socket } from "../socket"
import type { Hotbar } from "./hotbar"

export class PlayerItem {
  public _name: string
  public _type: "Damage"|"Heal"|"Utility"
  public _magnitude: number
  public _img: string
  #_player: MainPlayer
  #_hotbar: Hotbar
  #_socket: Socket
  
  constructor(
    item:Item,
    player: MainPlayer,
    hotbar: Hotbar,
    socket: Socket
  ) {
    this._name = item.name
    this._type = item.type
    this._magnitude = item.magnitude
    this._img = item.img
    this.#_player = player
    this.#_hotbar = hotbar
    this.#_socket = socket
  }

  public drop() {
    // call entity generation
  }

  public use() {
    switch (this._type) {
      case "Damage":
        // TODO: use the hitbox detection
        let target: Player|null = null /* DETECT TARGET WITH POINTER EVENT THING */
        if (target) {
          this.#_socket.send(new Packet(PacketType.interaction, [{ id: this.#_player.id, target: target._id, type: this._type, magnitude: this._magnitude }]))
        }
        break
      case "Heal":
        this.#_player.heal(this._magnitude)
        console.log(this.#_player.health)
        this.#_hotbar.healthChange(this.#_player.health)
        /* ALSO SEND THROUGH SOCKET */
        break
      case "Utility":
        // not sure what this means yet
        break
    }
  }
}

export const Items = {
  hammer: <Item>{ name: "Hammer", type: "Damage", magnitude: 5, img: "img-link"},
  spork: <Item>{ name: "Spork", type: "Damage", magnitude: 7, img: "img-link"},
  shovel: <Item>{ name: "Shovel", type: "Damage", magnitude: 10, img: "img-link"},
  dagger: <Item>{ name: "Dagger", type: "Damage", magnitude: 35, img: "img-link"},
  skillet: <Item>{ name: "Cast Iron Skillet", type: "Damage", magnitude: 10, img: "img-link"},
  bandage: <Item>{ name: "Bandage", type: "Heal", magnitude: 33, img: "img-link"},
  medkit: <Item>{ name: "Medkit", type: "Heal", magnitude: 100, img: "img-link"},
  rope: <Item>{ name: "Rope", type: "Utility", magnitude: 50, img: "img-link"},
}

interface Item {
  name: string,
  type: "Damage"|"Heal"|"Utility",
  magnitude: number,
  img: string
}