import { Scene, Engine, Vector3, MeshBuilder, HemisphericLight, ArcRotateCamera, FreeCamera } from 'babylonjs';
import { MainPlayer } from "../entity/mainPlayer"
import { Socket } from "../socket"
import { Packet, PacketType } from '../packet';
import { Player } from '../entity/player';

export class World {
    private _engine: Engine;
    private _scene: Scene;
    private _canvas: HTMLCanvasElement | null;
    private _playerCamera: FreeCamera;
    private _socket: Socket;
    private _player: MainPlayer
    private _players: Map<any, any>

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

            this._socket.send(new Packet(PacketType.info, [this._player]))

            this._engine.runRenderLoop(() => {
                this._scene.render();
                if (this._player) this._socket.send(new Packet(PacketType.movement, [{id: this._player.id, position: this._player.position }]))
            })

        })

    }

    private _initClient(name: string, id: string): void {
        this._player = new MainPlayer(
            name, 100, 0, new Vector3(0, 10, 0),
            id, this._scene, this._canvas,
            this._playerCamera
        )
        console.log("Created Main Player")
    }

    private _initPlayer(player: Player): void {
        this._players.set(player.id, player)
    }
    public onSocketData(data: Packet): void {
        console.log(data)
        switch (data?.type) {
            case "Update":
                console.log(data?.payload)
                console.log(this._player)
                break
            case "Info":
                let playerInfo: any = data?.payload[0].player;
                if (this._player === null || this._player?.id === playerInfo.id) this._initClient(playerInfo._name, playerInfo._id)
                else // init player
                break
            default:
                // throw some error
                break
        }
    }

}