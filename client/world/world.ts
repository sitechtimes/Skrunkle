import { Scene, Engine, Vector3, ArcRotateCamera, MeshBuilder, FreeCamera, UniversalCamera } from 'babylonjs';
import { Player } from "../entity/player"

export class World{
    private _engine: Engine;
    private _scene: Scene;
    private _canvas: HTMLCanvasElement | null

    constructor(canvas: HTMLCanvasElement | null){
        this._canvas = canvas;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
    }

    public init(): void{
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        const player = new Player(
            "Test Username", 100, 0, new Vector3(0, 10, 0), 
            "test-id", this._scene, this._canvas
        )
        
        var ground = MeshBuilder.CreateGround("ground", { width: 500, height: 500 }, this._scene);

        this._scene.executeWhenReady(()=>{

            this._engine.runRenderLoop(()=>{
                this._scene.render();
            })

        })

    }
    
}