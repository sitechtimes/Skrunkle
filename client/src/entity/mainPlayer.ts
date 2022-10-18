import { Vector3, UniversalCamera, Mesh, Scene, FreeCamera, MeshBuilder,  } from "babylonjs"
import { Player } from "./player"

export class MainPlayer extends Player {

    private _camera: FreeCamera;
    private _canvas: HTMLCanvasElement | null

    constructor(
        name: string,
        health: number,
        exp: number,
        position: Vector3,
        id: string,
        scene: Scene,
        canvas: HTMLCanvasElement | null,
        freeCamera: FreeCamera,
    ) {
        super(name, health, exp, position, id, scene, {renderBody: false});

        this._canvas = canvas;
        let createPointerLock = function(scene) {
            let canvas = scene.getEngine().getRenderingCanvas();
            canvas.addEventListener("click", event => {
              canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
              if(canvas.requestPointerLock) {
                canvas.requestPointerLock();
              }
            }, false);
          };
          createPointerLock(scene);
        this.scene.gravity = new Vector3(0, -9.81, 0);

        this._camera = freeCamera;
        this._camera.attachControl(canvas, true);
        this._camera.ellipsoid = new Vector3(2, 4, 2);
        this._camera.checkCollisions = true;
        this._camera.applyGravity = true;
        (<any>this._camera)._needMoveForGravity = true;

        this._camera.keysUp    = [87]; // W
        this._camera.keysDown  = [83]; // A
        this._camera.keysLeft  = [65]; // S
        this._camera.keysRight = [68]; // D
    }

    public get position(): Vector3{
        return this._camera.position;
    }

    public set position(new_position: Vector3){
        this._camera.position = new_position;
    }

    public set id(new_id: string){
        this.id = new_id;
    }

}