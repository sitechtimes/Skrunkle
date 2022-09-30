import { Vector3 } from "babylonjs"

export class Player{

    private _name: string;
    private _health: number;
    private _level: number;
    private _position: Vector3;

    constructor(name: string, health: number, level: number, position: Vector3){
        this._name = name;
        this._health = health;
        this._level = level;
        this._position = position;
    }

    public get position(): Vector3{
        return this._position;
    }

}