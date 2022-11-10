import { Vector3, UniversalCamera, Mesh, Scene, FreeCamera, MeshBuilder,  } from "@babylonjs/core"
import { Player } from "./player"

export class MainPlayer extends Player {

    private _camera: FreeCamera;
    private _canvas: HTMLCanvasElement

    constructor(
        name: string,
        health: number,
        exp: number,
        position: Vector3,
        rotation: Vector3,
        id: string,
        scene: Scene,
        canvas: HTMLCanvasElement,
        freeCamera: FreeCamera,
    ) {
        super(name, health, exp, position, rotation, id, scene, {renderBody: false, mainPlayer: true});

        this._canvas = canvas;
        // this.scene.gravity = new Vector3(0, -9.81, 0);

        this._camera = freeCamera;
        this._camera.attachControl(canvas, true);
        this._camera.ellipsoid = new Vector3(2, 4, 2); // body size
        this._camera.inertia = 0.5;
        this._camera.checkCollisions = true;
        // this._camera.applyGravity = true;
        // (<any>this._camera)._needMoveForGravity = true;

        this._camera.keysUp    = [87]; // W
        this._camera.keysDown  = [83]; // A
        this._camera.keysLeft  = [65]; // S
        this._camera.keysRight = [68]; // D

        this._createPointerLock()
    }

    private _createPointerLock(): void{
        if (this._canvas){
            this._canvas.addEventListener("click", event => {
                this._canvas.requestPointerLock = this._canvas.requestPointerLock || this._canvas.msRequestPointerLock || this._canvas.mozRequestPointerLock || this._canvas.webkitRequestPointerLock;
                if(this._canvas.requestPointerLock) {
                  this._canvas.requestPointerLock();
                }
            }, false);
        }
    }

    public get position(): Vector3{
        return this._camera.position;
    }

    public set position(new_position: Vector3){
        this._camera.position = new_position;
    }

    public get rotation(): Vector3{
        return this._camera.rotation
    }

    /* public set id(new_id: string){
        this.id = new_id;
    } */
}