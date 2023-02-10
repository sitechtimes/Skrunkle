import { Quaternion, Vector3, Mesh, MeshBuilder, PhysicsImpostor, Scene } from "babylonjs"
import { v4 as uuidv4 } from 'uuid';

export class Entities{

    private _name: string;
    private _object: any;
    private _id: string;

    constructor(name: string, position: Vector3, object: Mesh){
        this._name = name;
        this._id = `M-${uuidv4()}`
        if (object) {
            this._object = object;
            this._object.position = position;
        }
    }

    public get metadata(): string{
        return this._object.metadata
    }

    public get position(): Vector3{
        return this._object.position;
    }

    public get rotation(): Vector3{
        return this._object.rotation;
    }

    public set position(new_position: Vector3){
        if (this._object.position) this._object.position = new_position
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

    public update(linearVelocity: Vector3, angularVelocity: Vector3, position: Vector3){
        this._object.physicsImpostor.setAngularVelocity(new Vector3(angularVelocity._x, angularVelocity._y, angularVelocity._z));
        this._object.physicsImpostor.setLinearVelocity(new Vector3(linearVelocity._x, linearVelocity._y, linearVelocity._z));
        this._object.position = position;
    }

}

export function createEntity(scene: Scene, name: string, position: Vector3, mesh: Mesh, imposterType: number, mass: number, restitution: number): Entities{
    let entityImposter: PhysicsImpostor = new PhysicsImpostor(mesh, imposterType, { mass: mass, restitution: restitution }, scene);
    mesh.physicsImpostor = entityImposter
    return new Entities(name, position, mesh)
}