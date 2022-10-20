import { Scene, Engine, Vector3, MeshBuilder, HemisphericLight, ArcRotateCamera, FreeCamera, SceneLoader } from 'babylonjs';
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
<<<<<<< HEAD
    private _player: MainPlayer
    private _players: Map<any, any>
=======
    private _player: MainPlayer;
>>>>>>> 5e9350a908e1dc50bb44613146a3f62fae647872

    constructor(canvas: HTMLCanvasElement | null) {
        this._canvas = canvas;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
        this._players = new Map<string, Player>
    }

    public init(): void {
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        this._playerCamera = new FreeCamera("FreeCamera", new Vector3(0, 20, 0), this._scene);
        SceneLoader.Append("../gltf/", "chest.gltf", this._scene, function (scene) {
            // do something with the scene
        });
        var ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this._scene);
        ground.checkCollisions = true;
        var light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            this._scene
        );

        this._scene.executeWhenReady(() => {
            this._socket = new Socket(this);

            this._socket.send(new Packet(PacketType.info, [this._player], undefined),)

            this._engine.runRenderLoop(() => {
                this._scene.render();
                if (this._player) {
                    this._socket.send(new Packet(PacketType.movement, [{id: this._player.id, position: this._player.position }], this._player.id))
                }
            })

        })

    }

    private _initClient(name: string, id: string): void {
        this._player = new MainPlayer(
            name, 100, 0, new Vector3(0, 10, 0),
            id, this._scene, this._canvas,
            this._playerCamera
        )
        console.log("Created Main Player id: " + this._player.id)
    }

    private _initPlayer(player: Player): void {
        this._players.set(player.id, player)
    }
    public onSocketData(data: Packet): void {
        // console.log(data)
        switch (data?.type) {
            case "Update":
                let playerData = data.payload
                if (!this._players.has(playerData.id) && playerData.id != this._player.id){
                    let newPlayer: Player = new Player("temp-name", 100, 0, new Vector3(playerData.position.x, playerData.position.y, playerData.position.z), playerData.id, this._scene, {renderBody: true})
                    this._players.set(playerData.id, newPlayer)
                    console.log(`PLayer doesn't exist, creating a new player with id ${playerData.id}`)
                }else if (playerData.id != this._player.id) {
                    let player: Player = this._players.get(playerData.id)
                    player.position = playerData.position
                    this._players.set(player.id, player)
                }
                
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