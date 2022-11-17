import { Vector3, UniversalCamera, Mesh, Scene, FreeCamera, MeshBuilder, Camera, FreeCameraKeyboardMoveInput  } from "@babylonjs/core"
import { Player } from "./player"

const handleFreeCameraInputs = new FreeCameraKeyboardMoveInput().checkInputs

class CustomInput extends FreeCameraKeyboardMoveInput {       
    keysUp    = [87]; // W
    keysDown  = [83]; // A
    keysLeft  = [65]; // S
    keysRight = [68]; // D

    checkInputs(): void {
        handleFreeCameraInputs.apply(this)
        console.log("Wtf")
    }
}

export class MainPlayer extends Player {

    private _camera: FreeCamera;
    private _canvas: HTMLCanvasElement
    private _old_position: Vector3;

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

        this._old_position = this.position

        this._createPointerLock()

        this._camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
        this._camera.inputs.add(new CustomInput())
        console.log(this._camera.inputs.attached)
        // this._camera.inputs.removeByType("FreeCameraKeyboardMoveInput");

    }

    private _calculateForce(): void{
        if (this.position){
            let changeVector: Vector3 = new Vector3(this.position.x - this._old_position.x, this.position.y - this._old_position.y, this.position.z - this._old_position.z)
            console.log(changeVector);
            this._old_position = this.position
        }
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