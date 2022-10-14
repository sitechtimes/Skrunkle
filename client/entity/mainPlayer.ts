import { Vector3, UniversalCamera, Mesh, Scene, FreeCamera, MeshBuilder } from "babylonjs"
import { Player } from "./player"

export class MainPlayer extends Player {

    private _camera: FreeCamera;
    private _body: Mesh;
    private _scene: Scene;
    private _canvas: HTMLCanvasElement | null

    constructor(
        name: string,
        health: number,
        exp: number,
        position: Vector3,
        id: string,
        scene: Scene,
        canvas: HTMLCanvasElement | null
    ) {
        super(name, health, exp, position, id);

        this._scene = scene;
        this._canvas = canvas

        this._camera = new FreeCamera("Test Camera", new Vector3(this.position.x, this.position.y + 1, this.position.z), this._scene);
        this._camera.attachControl(this._canvas, true);
        this._body = MeshBuilder.CreateBox("MainPlayerBody", { size: 1, height: 2, width: 1 }, this._scene);
        this._body.position = this.position;

        this._camera.keysUp = [87];
        this._camera.keysDown = [83];
        this._camera.keysLeft = [65];
        this._camera.keysRight = [68];
        this._camera.inertia = 0.2;
        this._camera.fov = 1.5;
        this._camera.minZ = 0;
        this._camera.angularSensibility = 500;
        this._camera.speed = 2.5;

        document.addEventListener("keypress", ()=>{
            console.log(this._camera.position)
        })

    }

    // private HandleMovement(): void {
    //     this._camera.speed = speed + spood;
    //     this._camera.onCollide = function (colMesh) {
    //         if (colMesh.uniqueId === map.uniqueId) {
    //             wj = true;
    //         }
    //         // if (colMesh.uniqueId === map.uniqueId) {
    //         //   wj = true;
    //         // }
    //     };
    //     scene.gravity.y = grav;
    //     if (grav > -0.4) {
    //         grav -= 0.05;
    //     }
    //     cylinder.position = camera.position;
    //     camera.fov = 90;
    
    // }


}