import { Vector3, Quaternion } from "babylonjs"
import { v4 as uuidv4 } from 'uuid';

export class Entities{

    private _name: string;
    private _object: any;
    private _id: string;

    constructor(name: string, position: Vector3, rotation: Vector3, object: any | null){
        this._name = name;
        this._id = `M-${uuidv4()}`
        if (object) {
            this._object = object;
            this._object.position = position;
            this.rotation = rotation
        }
    }

    public get position(): Vector3{
        return this._object.position;
    }

    public set position(new_position: Vector3){
        if (this._object.position) this._object.position = new_position
    }

    public get rotation(): Vector3{
        return this._object.rotationQuaternion;
    }

    public set rotation(new_rotation: Vector3){
        if (this._object.rotation) this._object.rotationQuaternion = Quaternion.FromEulerAngles(new_rotation.x, new_rotation.y, new_rotation.z);
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