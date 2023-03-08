import { Scene, Mesh, PhysicsImpostor, Vector3 } from "babylonjs"

export class Entities{

    private _position: Vector3;
    private _name: string;
    private _id: string;
    private _object: any;
    public collide: boolean = false;

    constructor(name: string, id: string, position: Vector3, object: any | null){
        this._name = name;
        this._position = position;
        this._id = id;
        if (object) {
            this._object = object;
            this._object.position = this._position;

            this._object.onCollideObservable()

            // if (this._object.physicsImpostor) {
            //     this._object.physicsImpostor.onCollideEvent = (e)=>{
            //         this.collide = true;
            //         console.log("Started")
            //     }

            //     this._object.physicsImpostor.onCollideEventEnd = (e)=>{
            //         this.collide = false;
            //         console.log("Ended")
            //     }
            // }
        }
    }

    public get position(): Vector3{
        return this._object.position;
    }

    public get metadata(): string{
        return this._object.metadata
    }

    public set position(new_position: Vector3){
        this._position = new Vector3(new_position._x, new_position._y, new_position._z);
        if (this._object) this._object.position = this._position
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

    public set object(new_object: any){
        this._object = new_object
    }

    public update(linearVelocity: Vector3, angularVelocity: Vector3, position: Vector3){
        this._object.physicsImpostor.setAngularVelocity(new Vector3(angularVelocity._x, angularVelocity._y, angularVelocity._z));
        this._object.physicsImpostor.setLinearVelocity(new Vector3(linearVelocity._x, linearVelocity._y, linearVelocity._z));
        this._object.position = position;
    }

}

export function createEntity(scene: Scene, uid: string, name: string, position: Vector3, mesh: Mesh, imposterType: number, mass: number, restitution: number): Entities{
    let entityImposter: PhysicsImpostor = new PhysicsImpostor(mesh, imposterType, { mass: mass, restitution: restitution }, scene);
    mesh.physicsImpostor = entityImposter
    return new Entities(name, uid, position, mesh)
}