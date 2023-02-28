import { Scene, Engine, NullEngine, CannonJSPlugin, Vector3, ArcRotateCamera, MeshBuilder, Mesh, PhysicsImpostor, GroundMesh } from 'babylonjs';
import { Logger } from './logger';
import * as cannon from "cannon-es";
import { Generation } from './generation';
import { state_machine } from "./state_machine"
import { createEntity, Entities } from './entity/entities';

interface worldSize {
    top: Vector3,
    bottom: Vector3
}

export class World{
    private _engine: Engine;
    private _scene: Scene;
    private _tick_time: number = 5000; // in ms
    private _ticks_elapsed: number = 0;
    private _ground: GroundMesh;
    private logger: Logger = new Logger('World');
    private worldSize: worldSize = { top: new Vector3(50, 50, 50), bottom: new Vector3(-50, 0, -50)};
    public _generator: Generation

    constructor(){
        this._engine = new NullEngine();
        this._scene = new Scene(this._engine);

        this._generator = new Generation(this, this._scene)

<<<<<<< Updated upstream
=======
        this._ground = MeshBuilder.CreateGround("ground", {width: 1000, height: 1000}, this._scene);
        // this._ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        this._ground.physicsImpostor = new PhysicsImpostor(this._ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)

        for (let x = 0; x < 5; x ++){

            for (let z = 0; z < 5; z ++){

                let box: any =  MeshBuilder.CreateBox("box", { size: 10, height: 10, width: 10}, this._scene)
                box.physicsImpostor =  new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 90, restitution: 0 }, this._scene);
        
                let temp: Entities = new Entities("Box test", new Vector3(z * 10, 100, x * 10), new Vector3(0.1, 0.1, 0.1), box);
        
                this._entities.set(`M-${temp.id}`, temp)
            }

        }
        

        // this._entities.


        // console.log(this._ground.position)
>>>>>>> Stashed changes
    }

    private get _get_tick(): number{
        let ticks = Math.round(this._ticks_elapsed/this._tick_time * 1000);
        this._ticks_elapsed = 0;
        return ticks;
    }

    public validateEntityPosition(entityPosition: Vector3): Vector3{
        if (
            (entityPosition.x < this.worldSize.bottom.x || entityPosition.x > this.worldSize.top.x) ||
            (entityPosition.y < this.worldSize.bottom.y || entityPosition.y > this.worldSize.top.y) ||
            (entityPosition.z < this.worldSize.bottom.z || entityPosition.z > this.worldSize.top.z) 
        ) {
            console.log("EXCEEDED LIMITS: " + entityPosition + " compared to " +  this.worldSize.bottom + " and " + this.worldSize.top)
            return new Vector3(0, 10, 0);
        }
        else return entityPosition;
    }

    public init(): void{
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        var camera:ArcRotateCamera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), this._scene); 
        this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, cannon));

        this._scene.executeWhenReady(()=>{

            this.logger.progress("Scene is ready, running server side simulation");

            this._engine.runRenderLoop(()=>{
                this._scene.render();
                this._ticks_elapsed++;
                state_machine.update();
            })

        })

        this.logger.interval_logger(this._tick_time, ()=>{
            this.logger.progress(`Avg Server tick (${this._tick_time} ms): ${this._get_tick}`)
        })

        state_machine.setWorld(this)

        this._ground = MeshBuilder.CreateGround("ground", {width: 1000, height: 1000}, this._scene);
        this._ground.position = new Vector3(0, 0, 0)
        this._ground.physicsImpostor = new PhysicsImpostor(this._ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)

        this._generator.RANDOMIZE(this._generator.GENERATE.Cylinder(), 100, 100)
        this._generator.RANDOMIZE(this._generator.GENERATE.Box(), 100, 100)
    }

    
}