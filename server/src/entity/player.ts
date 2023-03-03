import { MeshBuilder, Scene, Vector3, Mesh, PhysicsImpostor } from "babylonjs"
import { v4 as uuidv4 } from 'uuid';
import { generateUsername } from "unique-username-generator";
import { Packet, PacketType } from "../packet";

export class Player{

    private _name: string;
    private _health: number;
    private _exp: number;
    private _position: Vector3;
    private _id: string;
    private _body: Mesh;

    constructor(
        scene: Scene,
        name?: string|undefined, 
        health?: number|undefined, 
        exp?: number|undefined, 
        position?: Vector3|undefined, 
    ){
        this._name = name || generateUsername();
        this._health = health || 100;
        this._exp = exp || 0;
        this._position = position || new Vector3(0, 0, 0);
        this._id = uuidv4();
        this._body = MeshBuilder.CreateBox(this._id, {height: 2, size: 0.5}, scene)
        let physicsImpostor = new PhysicsImpostor(this._body, PhysicsImpostor.BoxImpostor, { mass: 100, restitution: 0.5 }, scene)
        this._body.physicsImpostor = physicsImpostor
    }

    public get body(): Mesh{
        return this._body
    }

    public get position(): Vector3{
        return this._position;
    }

    public set position(new_position: Vector3){
        this._position = new_position;
    }

    public get name(): string{
        return this._name;
    }

    public set name(new_name: string){
        this._name = new_name;
    }

    public get health(): number{
        return this._health;
    }

    public set health(new_health: number){
        if (new_health < 0 || new_health > 100){
            throw new Error("Player entity health out of bound")
        }
        this._health = new_health;
    }

    public get exp(): number{
        return this._exp;
    }

    public set exp(new_exp: number){
        this._exp = new_exp;
    }

    public get id(): string{
        return this._id;
    }

    public serialize(type: PacketType = PacketType.movement, additional_info: any = {}): Packet{
        let info: any = {
            name: this._name,
            health: this._health,
            exp: this._exp, 
            position: this._position, 
        }

        for (let key of Object.keys(additional_info)){
            info[key] = additional_info[key]
        }

        let updatePacket: Packet = new Packet(type, [info], this._id)
        return updatePacket
    }

}