import { Vector3 } from "babylonjs"
import { v4 as uuidv4 } from 'uuid';
import { generateUsername } from "unique-username-generator";

export class Player{

    private _name: string;
    private _health: number;
    private _exp: number;
    private _position: Vector3;
    private _id: string;

    constructor(
        name?: string|undefined, 
        health?: number|undefined, 
        exp?: number|undefined, 
        position?: Vector3|undefined, 
        id?: string|undefined
    ){
        this._name = name || generateUsername();
        this._health = health || 100;
        this._exp = exp || 0;
        this._position = position || new Vector3(0, 0, 0);
        this._id = uuidv4();
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

}