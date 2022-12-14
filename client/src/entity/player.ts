import { Mesh, Scene, MeshBuilder, Vector3, SceneLoader, TransformNode, DynamicTexture, Plane, StandardMaterial } from "@babylonjs/core"

export class Player {

    private _name: string;
    private _health: number;
    private _exp: number;
    private _position: Vector3;
    private _rotation: Vector3;
    private _id: string;
    private _body: Mesh | TransformNode = new TransformNode("player-mesh");
    private _scene: Scene;
    private _nametag: Mesh;
    private _nametag_y_offset: number = 0.5;

    constructor(
        name: string,
        health: number,
        exp: number,
        position: Vector3,
        rotation: Vector3,
        id: string,
        scene: Scene,
        options: { renderBody?: boolean, mainPlayer?: boolean } = { renderBody: true, mainPlayer: false }
    ) {
        this._name = name;
        this._health = health;
        this._exp = exp;
        this._id = id;
        this._scene = scene

        this._loadBody(options);
        this._position = position;
        this._rotation = new Vector3(Math.PI / 2, Math.PI, 0);

        /*NAME TAG*/
        if (!options.mainPlayer){
            this._nametag = MeshBuilder.CreatePlane("NamePlane", {width: 2, height: 2}, this._scene) // fix ltr
            let planeMat: StandardMaterial = new StandardMaterial("NameTagMaterialMaterial", this._scene)
            let planeTexture: DynamicTexture = new DynamicTexture("NametagTexture", {width:750, height:256}, this._scene)
            planeTexture.getContext()
            planeTexture.hasAlpha = true
            planeTexture.drawText(this._name, 0, 75, "bold 75px Arial", "black", null, true, true)
            planeMat.backFaceCulling = false
            planeMat.diffuseTexture = planeTexture

            this._nametag.material = planeMat;
            this._nametag.billboardMode = Mesh.BILLBOARDMODE_ALL;
            this._nametag.position = new Vector3(this._position.x, this._position.y + this._nametag_y_offset, this._position.z)
        }
    }

    private async _loadBody(options: any){
        if (options.renderBody) {
            let bodies: any = await SceneLoader.ImportMeshAsync("", "meshes/", "player.babylon", this._scene)
            this._setBody(bodies)
        }
    }

    private _setBody(scene: any) {
        let parent: TransformNode = new Mesh("player-group", this._scene)
        for (let child of scene.meshes) {
            child.position = new Vector3(0, 0, 0)
            child.parent = parent
        }
        parent.position = new Vector3(0, 0, 0)
        // parent.rotation = new Vector3(Math.PI / 2, Math.PI, 0)
        // parent.scaling = new Vector3(0.25, 0.25, 0.25)
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
        if (this._nametag){
            this._nametag.position = new Vector3(this._position._x, this._position._y + this._nametag_y_offset, this._position._z)
        }
    }

    public get rotation(): Vector3 {
        return this._rotation;
    }

    public set rotation(new_rotation: Vector3) {
        this._rotation = new_rotation;
        if (this._body) {
            this._body.rotation.y = new_rotation._y + Math.PI;
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
        if (this._nametag) {
            this._nametag.dispose()
        }
    }

    protected get scene(): Scene {
        return this._scene
    }

}