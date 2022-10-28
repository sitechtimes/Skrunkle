import { Scene, Engine, Vector3, MeshBuilder, HemisphericLight, ArcRotateCamera, FreeCamera, SceneLoader, TransformNode, vecToLocal, Matrix, Size, StandardMaterial, Color3, KeyboardEventTypes, PointerEventTypes} from 'babylonjs';
import "@babylonjs/loaders/glTF";
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
    private _player: MainPlayer;
    private _players:  Map<string, Player>;

    constructor(canvas: HTMLCanvasElement | null) {
        this._canvas = canvas;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
        this._players = new Map<string, Player>;
    }

    public init(): void {
        this._scene.useRightHandedSystem = true;
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        this._playerCamera = new FreeCamera("FreeCamera", new Vector3(0, 20, 0), this._scene);
        var ground = MeshBuilder.CreateGround("ground", { width: 500, height: 500 }, this._scene);
        ground.checkCollisions = true;
        var light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            this._scene
        );
        const box = MeshBuilder.CreateBox("box", {height:2, width:2, depth:2})
        box.position.y=2;
        box.metadata = "box";
        box.checkCollisions = true;
        var myMaterial =  new StandardMaterial("myMaterial", this._scene);

myMaterial.diffuseColor = new Color3(1, 0, 1);
myMaterial.specularColor = new Color3(0.5, 0.6, 0.87);
myMaterial.emissiveColor = new Color3(1, .1, 1);
myMaterial.ambientColor = new Color3(0.23, 0.98, 0.53);

box.material = myMaterial;
  this._scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {

      case PointerEventTypes.POINTERTAP:
        this._castRay();
        break;
    }
  });
this._castRay();
        this._scene.executeWhenReady(() => {
            this._socket = new Socket(this);

            this._socket.send(new Packet(PacketType.info, [this._player], undefined),)

            this._engine.runRenderLoop(() => {
                this._scene.render();
                if (this._player) {
                    this._socket.send(new Packet(PacketType.movement, [{id: this._player.id, position: this._player.position, rotation: this._player.rotation }], this._player.id))
                }
            })

        })

        this.listen()

    }

    private listen() {
        window.onunload = () => {
            this._socket.close(this._player.id)
        }
    }

    private _initClient(name: string, id: string): void {
        this._player = new MainPlayer(
            name, 100, 0, new Vector3(0, 10, 0), new Vector3(0, 0, 0),
            id, this._scene, this._canvas,
            this._playerCamera
        )
        console.log("Created Main Player id: " + this._player.id)
    }
    private _castRay(){
        var ray = this._scene.createPickingRay(this._scene.pointerX, this._scene.pointerY, Matrix.Identity(), this._playerCamera);	
        var hit = this._scene.pickWithRay(ray);
    
        if (hit.pickedMesh && hit.pickedMesh.metadata == "box"){
            console.log("hit")
        }
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
                    let newPlayer: Player = new Player("temp-name", 100, 0, new Vector3(playerData.position.x, playerData.position.y, playerData.position.z), new Vector3(playerData.position.x, playerData.position.y, playerData.position.z), playerData.id, this._scene, {renderBody: true})
                    this._players.set(playerData.id, newPlayer)
                    console.log(`PLayer doesn't exist, creating a new player with id ${playerData.id}`)
                }else if (playerData.id != this._player.id) {
                    let player: Player = this._players.get(playerData.id)
                    player.position = playerData.position
                    player.rotation = playerData.rotation
                    this._players.set(player.id, player)
                }
                
                break
            case "Info":
                let playerInfo: any = data?.payload[0].player;
                if (this._player === null || this._player?.id === playerInfo.id) this._initClient(playerInfo._name, playerInfo._id)
                else // init player
                break
            case "Close":
                let player: Player = this._players.get(data.payload[0].id)
                player.delete()
                this._players.delete(data.payload[0].id)
                break
            default:
                // throw some error
                break
        }
    }

}
