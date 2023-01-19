import { Vector3, Quaternion } from "babylonjs"

export class Entities{

    private _position: Vector3;
    private _rotation: Vector3;
    private _name: string;
    private _id: string;
    private _object: any;

    constructor(name: string, id: string, position: Vector3, rotation: Vector3, object: any | null){
        this._name = name;
        this._position = position;
        this._rotation = rotation;
        this._id = id;
        if (object) {
            this._object = object;
            this._object.position = this._position;
            this.rotation = this._rotation
        }
    }

    public get position(): Vector3{
        return this._position;
    }

    public set position(new_position: Vector3){
        this._position = new_position;
        if (this._object) this._object.position = this._position
    }

    public get rotation(): Vector3{
        return this._rotation;
    }

    public set rotation(new_rotation: Vector3){
        this._rotation = new_rotation;
        if (this._object) this._object.rotationQuaternion = Quaternion.FromEulerAngles(new_rotation.x, new_rotation.y, new_rotation.z);
    }

    public get name(): string{
        return this._name;
    }

    public set name(new_name: string){
        this._name = new_name;
    }

    public get id(): string{
        return this._id;
    }

    public get object(): any{
        return this._object
    }

}