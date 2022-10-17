import { Vector3 } from "babylonjs"
import { v4 as uuidv4 } from 'uuid';

export class Item{

    private _position: Vector3;
    private _name: string;
    private _amount: number;
    private _id: string;

    constructor(name: string, position: Vector3, amount: number){
        this._name = name;
        this._position = position;
        this._amount = amount;
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

    public get amount(): number{
        return this._amount;
    }

    public set amount(new_amount: number){
        this._amount = new_amount;
    }

    public get id(): string{
        return this._id;
    }

}