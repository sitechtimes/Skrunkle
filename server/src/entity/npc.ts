import { Vector3 } from "babylonjs";
import { Entities } from "./entities"

export class NPC{

    private entity: Entities;

    constructor(entity: Entities){
        this.entity = entity
        this._applyForce()
    }

    private _applyForce():void{ 
        let random_impulse: Vector3 = new Vector3(Math.random() * 10, 0, Math.random() * 10)
        let random_interval:number = Math.random() * 10000

        this.entity.object.physicsImpostor.applyImpulse(random_impulse, this.entity.object.getAbsolutePosition())
        setTimeout(()=>{this._applyForce()}, random_interval)
    }

}