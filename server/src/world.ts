import { Scene, Engine, NullEngine } from 'babylonjs';

export class World{
    private _engine: Engine;
    private _scene: Scene;

    constructor(){
        this._engine = new NullEngine();
        this._scene = new Scene(this._engine);
    }

    public init(): void{
        this._scene.enablePhysics();

        this._scene.executeWhenReady(()=>{
            this._engine.runRenderLoop(()=>{
                this._scene.render()
            })
        })
    }
    
}