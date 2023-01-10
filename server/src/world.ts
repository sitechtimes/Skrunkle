import { Scene, Engine, NullEngine, CannonJSPlugin, Vector3, ArcRotateCamera, MeshBuilder, Mesh } from 'babylonjs';
import { Logger } from './logger';
import * as cannon from "cannon-es";
import { Generation } from './generation';

interface worldSize {
    top: Vector3,
    bottom: Vector3
}

export class World{
    private _engine: Engine;
    private _scene: Scene;
    private _tick_time: number = 5000; // in ms
    private _ticks_elapsed: number = 0;
    private _entities: any[] = [];
    private logger: Logger = new Logger('World');
    private worldSize: worldSize = { top: new Vector3(50, 50, 50), bottom: new Vector3(-50, 0, -50)};
    public _generator: Generation

    constructor(){
        this._engine = new NullEngine();
        this._scene = new Scene(this._engine);

        this._generator = new Generation(this, this._scene)

        this._entities.push(this._generator.GENERATE.TestBox())
        // this._entities.push(MeshBuilder.CreateBox("box", { size: 2, height: 2, width: 2}, this._scene))

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

        // this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, cannon));

        this._scene.executeWhenReady(()=>{

            this.logger.progress("Scene is ready, running server side simulation");

            this._engine.runRenderLoop(()=>{
                this._scene.render();
                this._ticks_elapsed++;
            })

        })

        this.logger.interval_logger(this._tick_time, ()=>{
            this.logger.progress(`Avg Server tick (${this._tick_time} ms): ${this._get_tick}`)
        })
        
    }

    public get entities(): any[]{
        return this._entities
        // return this._entities.map((entity: Mesh)=>{
        //     return {name: entity.name, position: entity.position}
        // })
    }

    public addEntity(item: Mesh) {
        this.entities.push(item)
    }
    
}