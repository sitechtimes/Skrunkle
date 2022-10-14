import { Vector3, UniversalCamera, Mesh, Scene, FreeCamera } from "babylonjs"

export class Player{

    private _name: string;
    private _health: number;
    private _exp: number;
    private _position: Vector3;
    private _id: string;
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
    ){
        this._name = name;
        this._health = health;
        this._exp = exp;
        this._position = position;
        this._id = id;
        this._scene = scene;
        this._canvas = canvas

        this._camera = new FreeCamera("Test Camera", this._position, this._scene); 
        this._camera.attachControl(this._canvas, true);

    }

    public get position(): Vector3{
        return this._position;
    }

    public set position(new_position: Vector3){
        this._position = new_position;
        this._camera.position = this._position;
        this._body.position = this._position;
    }

    public get name(): string{
        return this._name;
    }

    public set name(new_name: string){
        this._name = new_name;
    }

    public get health(): number{
        return this._health;
    }

    public set health(new_health: number){
        if (new_health < 0 || new_health > 100){
            throw new Error("Player entity health out of bound")
        }
        this._health = new_health;
    }

    public get exp(): number{
        return this._exp;
    }

    public set exp(new_exp: number){
        this._exp = new_exp;
    }

    public get id(): string{
        return this._id;
    }

}