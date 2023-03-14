import { World } from "./world/world";
import { Entities } from "./entity/entities";
import { Socket } from "./socket";
import { Packet, PacketType } from "./packet";
import { Player } from "./entity/player";
import { MainPlayer } from "./entity/mainPlayer";

class State_machine {
  public players: Map<string, Player> = new Map();
  public entities: Map<string, Entities> = new Map();
  private _client: MainPlayer

  // private socket_ref: Socket;
  // private world_ref: World;

  // private ready(){
  //     console.log("Checking status of State Machine")
  //     if (this.socket_ref) console.log("State Machine has Socket!")
  //     if (this.world_ref) console.log("State Machine has World!")
  //     if (this.socket_ref && this.world_ref) {
  //         console.log("State Machine is ready!")
  //     }
  // }

  // public setSocket(socket_ref: Socket): void{
  //     this.socket_ref = socket_ref;
  //     this.ready()
  // }

  // public setWorld(world_ref: World): void{
  //     this.world_ref = world_ref;
  //     this.ready()
  // }

  public update_player(uid: string, player: Player) {
    this.players.set(uid, player);
  }

  public update_entity(uid: string, entity: Entities) {
    this.entities.set(uid, entity);
  }

  public add_player(uid: string, player: Player) {
    this.players.set(uid, player);
  }

  public add_entity(uid: string, entity: Entities) {
    this.entities.set(uid, entity);
  }

  public delete_player(uid: string) {
    this.players.delete(uid);
  }

  public delete_entity(uid: string) {
    this.entities.delete(uid);
  }

  public set client(player: MainPlayer) {
    this._client = player
  }

  public get client() {
    return this._client
  }
}

const state_machine = new State_machine();

export { state_machine };
