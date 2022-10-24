import { Mesh, MeshBuilder, Scene, Vector3, SceneLoader, TransformNode } from "babylonjs"

export class Player {

    private _name: string;
    private _health: number;
    private _exp: number;
    private _position: Vector3;
    private _id: string;
    private _body: Mesh | TransformNode | null = null;
    private _scene: Scene;

    constructor(
        name: string,
        health: number,
        exp: number,
        position: Vector3,
        id: string,
        scene: Scene,
        options: { renderBody?: boolean } = { renderBody: true }
    ) {
        this._name = name;
        this._health = health;
        this._exp = exp;
        this._id = id;
        this._scene = scene

        if (options.renderBody) {
            SceneLoader.ImportMesh("", "meshes/", "player.babylon", this._scene, this._init)
        }
        this._position = position;
    }

    private _init(scene: any) {
        let parent: TransformNode = new TransformNode("grouped-mesh")
        for (let child of scene) {
            child.parent = parent
        }
        parent.position = new Vector3(0, 3, 0)
        parent.rotation = new Vector3(Math.PI / 2, 0, 0)
        parent.scaling = new Vector3(0.25, 0.25, 0.25)
        this._body = parent
    }

    public get position(): Vector3 {
        return this._position;
    }

    public set position(new_position: Vector3) {
        this._position = new_position;
        if (this._body) {
            this._body.position = this._position;
        }
    }

    public get name(): string {
        return this._name;
    }

    public set name(new_name: string) {
        this._name = new_name;
    }

    public get health(): number {
        return this._health;
    }

    public set health(new_health: number) {
        if (new_health < 0 || new_health > 100) {
            throw new Error("Player entity health out of bound")
        }
        this._health = new_health;
    }

    public get exp(): number {
        return this._exp;
    }

    public set exp(new_exp: number) {
        this._exp = new_exp;
    }

    public get id(): string {
        return this._id;
    }

    public delete() {
        if (this._body) {
            this._body.dispose()
        }
    }

    protected get scene(): Scene {
        return this._scene
    }

}