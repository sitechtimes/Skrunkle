import { Scene, Engine, NullEngine, CannonJSPlugin, Vector3, ArcRotateCamera } from 'babylonjs';
import { Logger } from './logger';
import * as cannon from "cannon-es";
import { Packet } from './packet';
import { Player } from './entity/player';

export class World{
    private _engine: Engine;
    private _scene: Scene;
    private _tick_time: number = 5000; // in ms
    private _ticks_elapsed: number = 0;
    private logger: Logger = new Logger('World');
    private _players: Map<string, Player>

    constructor(){
        this._engine = new NullEngine();
        this._scene = new Scene(this._engine);
        this._players = new Map<string, Player>
    }

    private get _get_tick(): number{
        let ticks = Math.round(this._ticks_elapsed/this._tick_time * 1000);
        this._ticks_elapsed = 0;
        return ticks;
    }

    public init(): void{
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        var camera:ArcRotateCamera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), this._scene); 

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
    
    public onSocketData(data:Packet): void {
        switch (data.type) {
            case "Update":

                break
            case "Info":

                break
            case "Close":
                let player: Player = this._players.get(data.payload[0].id)
                player.delete()
                this._players.delete(data.payload[0].id)
                break
            default:
                // throw some error
                break
        }
    }
}