import { Vector3 } from "@babylonjs/core";
import { Entities } from "./entities"

export class NPC{

    private entity: Entities;

    constructor(entity: Entities){
        this.entity = entity
        this.random_actions()
    }

    private _applyforce():void{
        this.entity.object.physicsImpostor.applyImpulse(new Vector3(), this.entity.object.getAbsolutePosition())
    }

    private random_actions(){
        this._applyforce();
        setTimeout(this.random_actions, Math.random() * 1000)
    }

}