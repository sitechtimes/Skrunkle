import { Scene, Engine, Vector3, MeshBuilder, HemisphericLight, ArcRotateCamera, FreeCamera } from 'babylonjs';
import { MainPlayer } from "../entity/mainPlayer"
import { Socket, Message } from "../socket"

export class World {
    private _engine: Engine;
    private _scene: Scene;
    private _canvas: HTMLCanvasElement | null;
    private _playerCamera: FreeCamera;
    private _socket: Socket;
    private _player: MainPlayer

    constructor(canvas: HTMLCanvasElement | null) {
        this._canvas = canvas;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
    }

    public init(): void {
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        this._playerCamera = new FreeCamera("FreeCamera", new Vector3(0, 20, 0), this._scene);

        var ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this._scene);
        ground.checkCollisions = true;
        var light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            this._scene
        );

        this._scene.executeWhenReady(() => {
            this._socket = new Socket(this);

            this._engine.runRenderLoop(() => {
                this._scene.render();
                if (this._player) this._socket.send( <Message> { type: "movement", payload: [ {id: this._player.id, position: this._player.position } ] })
            })

        })

    }

    private _initPlayer(name: string, id: string): void {
        this._player = new MainPlayer(
            "temp_name", 100, 0, new Vector3(0, 10, 0),
            "temp_id", this._scene, this._canvas,
            this._playerCamera
        )
        console.log("Created Player")
    }

    public onSocketData(data: any): void {
        console.log(data)
        switch (data?.type) {
            case "Update":
                console.log(data?.payload)
                break
            case "Info":
                let playerInfo: any = data?.payload[0].player;
                this._initPlayer(playerInfo._name, playerInfo._id)
                break
            default:
                // throw some error
                break
        }
    }

}