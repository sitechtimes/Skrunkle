import { World } from "./world"
import { Entities } from "./entity/entities";
import { Logger } from "./logger";
import { SocketServer } from "./server";
import { Packet, PacketType } from "./packet"
import { Player } from "./entity/player";
import { Vector3 } from "babylonjs";

class State_machine{

    public players: Map<string, Player> = new Map();
    public entities: Map<string, Entities> = new Map(); 
    public old_entities: Map<string, Entities> = new Map(); 

    private logger: Logger = new Logger("STATE_MACHINE");
    private socket_ref: SocketServer;
    private world_ref: World;

    constructor(){
        this.logger = new Logger("STATE_MACHINE")
        this.logger.progress("State machine initiated");
    }

    private ready(){
        this.logger.progress("Checking status of State Machine")
        if (this.socket_ref) this.logger.progress("State Machine has Socket!")
        if (this.world_ref) this.logger.progress("State Machine has World!")
        if (this.socket_ref && this.world_ref) {
            this.logger.pass("State Machine is ready!")
            this.update()
        }
    }

    public setSocket(socket_ref: SocketServer): void{
        this.socket_ref = socket_ref;
        this.ready()
    }

    public setWorld(world_ref: World): void{
        this.world_ref = world_ref;
        this.ready()
    }

    private pass_changes(a: Entities, b: Entities): void{
        // let pos_change: Vector3 = a.position.subtract(b.position);
        // let rot_change: Vector3 = a.angularVelocity.subtract(b.angularVelocity);

        console.log(b.position)
    }

    private broadcast_entity(): void{
        for (let uid of this.entities.keys()){
            let entity: Entities = this.entities.get(uid);
            let entity_old: Entities = this.old_entities.get(uid)

            this.pass_changes(entity, entity_old)
            this.socket_ref.broadCast(entity.serialize())
        }
    }

    private broadcast_player(): void{
        for (let uid of this.players.keys()){
            let player_entity: Player = this.players.get(uid);
            this.socket_ref.broadCast(player_entity.serialize(PacketType.update))
        }
    }

    public update_player(uid: string, player: Player){
        this.players.set(uid, player);
    }

    public update_entity(uid: string, entity: Entities){
        this.entities.set(uid, entity);
    }

    public add_player(uid: string, player: Player){
        this.players.set(uid, player);
    }

    public add_entity(uid: string, entity: Entities){
        this.entities.set(uid, entity);
        let copy: Entities = {...entity}
        this.old_entities.set(uid, copy)
    }

    public delete_player(uid: string){
        this.players.delete(uid)
    }

    public delete_entity(uid: string){
        this.entities.delete(uid)
        this.old_entities.delete(uid)
    }

    public has_player(uid: string): boolean{
        return this.players.has(uid);
    }

    public has_entity(uid: string): boolean{
        return this.entities.has(uid);
    }

    public update(){
        if (!this.socket_ref) {
            this.logger.error("State Machine does not have socket reference")
            return
        }
        if (!this.world_ref) {
            this.logger.error("State Machine does not have world reference")
            return
        }
        this.broadcast_entity()
        this.broadcast_player()
    }

}

const state_machine = new State_machine()

export { state_machine }