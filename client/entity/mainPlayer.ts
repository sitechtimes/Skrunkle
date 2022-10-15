import { Vector3, UniversalCamera, Mesh, Scene, FreeCamera, MeshBuilder } from "babylonjs"
import { Player } from "./player"

export class MainPlayer extends Player {

    private _camera: FreeCamera;
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

        this._scene.gravity = new Vector3(0, -9.81, 0);

        this._camera = new FreeCamera("FreeCamera", new Vector3(0, 20, 0), this._scene);
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


}