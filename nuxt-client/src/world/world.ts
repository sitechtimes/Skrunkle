import {
  Scene,
  Engine,
  Vector3,
  MeshBuilder,
  HemisphericLight,
  FreeCamera,
  StandardMaterial,
  Matrix,
  KeyboardEventTypes,
  AbstractMesh,
  CannonJSPlugin,
  SceneLoader,
  PhysicsImpostor
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import * as cannon from "cannon-es";
import { MainPlayer } from "../entity/mainPlayer";
import { Socket } from "../socket";
import { Packet, PacketType } from "../packet";
import { Player } from "../entity/player";
import { GUI } from "../gui/gui";
import { Hotbar } from "../gui/hotbar";
import { Items, PlayerItem } from "../gui/items";
import { Generation } from "./generation";
import { Chat } from "../chat/chat";
import { state_machine } from "../state_machine";
import { createEntity, Entities } from "../entity/entities";

export class World {
  private _engine: Engine;
  private _scene: Scene;
  private _canvas: HTMLCanvasElement | null;
  private _playerCamera: FreeCamera | null = null;
  private _entities: any[] = [];
  private _socket: Socket;
  private _player: MainPlayer | undefined;
  private _players: Map<string, Player>;
  private _GUI: GUI;
  // @ts-expect-error
  private _hotbar: Hotbar;
  private _debug: boolean = true;
  public chestOpen: boolean;
  private _pickup: boolean;
  private _pickedup: boolean;
  // @ts-expect-error
  private _testMaterial: StandardMaterial;
  private _generator: Generation;
  private _chat: Chat | undefined;
  private _itemchosen: number;

  constructor(canvas: HTMLCanvasElement | null) {
    this._canvas = canvas;
    this._engine = new Engine(this._canvas);
    this._scene = new Scene(this._engine);
    this._GUI = new GUI(this._scene);
    this._players = new Map<string, Player>();
    this._socket = new Socket(this);
    this._chat = new Chat(this._socket, this._player!);
    this._generator = new Generation(this, this._scene);
    this._testMaterial = new StandardMaterial("_testMaterial", this._scene);
    this.chestOpen = false;
    this._pickup = false;
    this._pickedup = false;
    this._itemchosen = 0;

    this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, cannon));
  }

  public init(): void {
    this._scene.useRightHandedSystem = true;
    // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
    this._playerCamera = new FreeCamera(
      "FreeCamera",
      new Vector3(0, 6, 0),
      this._scene
    );
    var ground = MeshBuilder.CreateGround(
      "ground",
      { width: 1000, height: 1000 },
      this._scene
    );
    ground.position = new Vector3(0, 0, 0);
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)
    ground.checkCollisions = true;
    // @ts-expect-error
    var light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      this._scene
    );


    //   this._scene.onPointerObservable.add((pointerInfo) => {
    //     switch (pointerInfo.type) {
    //       case PointerEventTypes.POINTERWHEEL:
    //         this._castRay();

    //         break;
    //     }

    //   });
    this._scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          switch (kbInfo.event.key) {
            case "e":
              this._castRay();
              break;
            case "q":
              if (this._pickedup) {
                this._pickedup = false;
                document.getElementById("PickedupItem")!.innerHTML = "";
              }
              break;
          }
          break;
      }
    });
    this._GUI.createHotbar();
    this._hotbar = this._GUI.hotbar;
    console.log(this._hotbar);

    // this._generator.GENERATE.TestCyclinder();

    this._GUI.createHotbar();
    this._hotbar = this._GUI.hotbar;

    this._scene.executeWhenReady(() => {
      // TODO: Find out a way to avoid circular JSON error below. This never used to happen
      // let {_scene, ...bodyRef} = this._player!._body
      // this._socket.send(new Packet(PacketType.info, [{id: this._player!.id, _body: bodyRef}], ""));
      this._socket.send(
        new Packet(PacketType.info, [{ id: this._player!.id }], "")
      );

      this._engine.runRenderLoop(() => {
        this._scene.render();
        if (this._player) {
          this._socket?.send(
            new Packet(
              PacketType.movement,
              [
                {
                  id: this._player.id,
                  name: this._player.name,
                  position: this._player.position,
                  rotation: this._player.rotation,
                  current: this._hotbar.current,
                },
              ],
              this._player.id
            )
          );
          if (this._debug) {
            document.getElementById(
              "x"
            )!.innerText = `X: ${this._player.position.x}`;
            document.getElementById(
              "y"
            )!.innerText = `Y: ${this._player.position.y}`;
            document.getElementById(
              "z"
            )!.innerText = `Z: ${this._player.position.z}`;
          }
        }
      });
    });

    onclick = () => {
      let dray = this._scene.createPickingRay(
        960,
        540,
        Matrix.Identity(),
        this._playerCamera
      );
      let hit = this._scene.pickWithRay(dray);

      if (
        this._evaluateDistance(hit!.pickedMesh!) <=
          this._hotbar.current?._range! ||
        this._hotbar.current!._type == "Heal"
      ) {
        this._hotbar.use(hit?.pickedMesh?.name);
      }
    };

    this.listen();

  }

  private listen() {
    window.onunload = () => {
      this._socket.close(this._player!.id);
      if (this._player?.id) this._socket?.close(this._player.id);
    };
  }

  private _castRay() {
    var dray = this._scene.createPickingRay(
      960,
      540,
      Matrix.Identity(),
      this._playerCamera
    );
    var hit = this._scene.pickWithRay(dray);
    // new RayHelper(dray).show(this._scene, new Color3(.3,1,.3));
    if (this.chestOpen == false) {
      if (
        (hit!.pickedMesh && hit!.pickedMesh.metadata == "Box") ||
        hit!.pickedMesh!.metadata == "Box"
      ) {
        console.log("hit");
        this.chestOpen = true;
        document
          .getElementById("debug")!
          .insertAdjacentHTML(
            "beforeend",
            "<div id='chestOpen'>Chest is Open</div>"
          );
      } else {
        console.log("not hit");
        this.chestOpen = false;
        document.getElementById("chestOpen")!.remove();
      }
    } else {
      this.chestOpen = false;
      document.getElementById("chestOpen")!.remove();
    }
  }
  private _evaluateDistance(mesh: AbstractMesh): number {
    // thank you precalc
    let totalVector = [
      mesh.position.x - this._player!.position.x,
      mesh.position.y - this._player!.position.y,
      mesh.position.z - this._player!.position.z,
    ];

    let vectorMagnitude = Math.sqrt(
      totalVector[0] * totalVector[0] +
        totalVector[1] * totalVector[1] +
        totalVector[2] * totalVector[2]
    );

    return vectorMagnitude;
  }
  private _castLookingRay() {
    var dray = this._scene.createPickingRay(
      960,
      540,
      Matrix.Identity(),
      this._playerCamera
    );
    var hit = this._scene.pickWithRay(dray);

    // new RayHelper(dray).show(this._scene, new Color3(.3,1,.3));
      // console.log(hit?.pickedMesh)
    if (!hit?.pickedMesh) return
    if (
      (hit!.pickedMesh != null  && hit!.pickedMesh.metadata == "item") ||
      hit!.pickedMesh!.metadata == "Cylinder" ||
      hit!.pickedMesh!.metadata == "Box"
    ) {
      console.log("hit");
      this._pickup = true;

      if ((hit!.pickedMesh!.id != "ground")) {
        this._scene.onKeyboardObservable.add((kbInfo) => {
          switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
              if (kbInfo.event.key == "f") {
                this._pickedup = true;
                var dray = this._scene.createPickingRay(
                  960,
                  540,
                  Matrix.Identity(),
                  this._playerCamera
                );
                var hit = this._scene.pickWithRay(dray);
                this._itemchosen = hit!.pickedMesh!.uniqueId;
                document.getElementById("PickedupItem")!.innerHTML = "Picked Up";
              }
            break;
        }
      });
    } else {
      this._pickup = false;
    }
    }}
  private _initClient(name: string, id: string): void {
    this._player = new MainPlayer(
      name,
      100,
      0,
      new Vector3(0, 10, 0),
      new Vector3(0, 0, 0),
      id,
      this._scene,
      this._canvas,
      this._playerCamera!
    );
    if (this._debug)
      document.getElementById("name")!.innerText = `Name: ${this._player.name}`;
    if (this._debug)
      document.getElementById("id")!.innerText = `UserID: ${this._player.id}`;
    this._hotbar.inventory = this._player.inventory;
    /* TEMPORARILY ADDING ITEMS */
    this._hotbar.add(
      new PlayerItem(Items.hammer, this._player, this._hotbar, this._socket),
      1
    );
    this._hotbar.add(
      new PlayerItem(Items.dagger, this._player, this._hotbar, this._socket),
      2
    );
    this._hotbar.add(
      new PlayerItem(Items.shovel, this._player, this._hotbar, this._socket),
      3
    );
    this._hotbar.add(
      new PlayerItem(Items.spork, this._player, this._hotbar, this._socket),
      5
    );
    this._hotbar.add(
      new PlayerItem(Items.slingshot, this._player, this._hotbar, this._socket),
      6
    );
    this._hotbar.add(
      new PlayerItem(Items.bandage, this._player, this._hotbar, this._socket),
      10
    );
    this._hotbar.add(
      new PlayerItem(Items.medkit, this._player, this._hotbar, this._socket),
      8
    );
    this._hotbar.add(
      new PlayerItem(Items.skillet, this._player, this._hotbar, this._socket),
      7
    );
    /* TEMPORARILY ADDED ITEMS */
    this._chat = new Chat(this._socket, this._player);

    console.log("Created Main Player id: " + this._player.id);
    // console.log(this._player.inventory);
  }

  private _initPlayer(player: Player): void {
    this._players.set(player.id, player);
  }
  public async onSocketData(data: Packet): Promise<void> {
    switch (data?.type) {
      case "Update":
        let playerData = data.payload;
        if (
          !this._players.has(playerData.id) &&
          playerData.id != this._player!.id
        ) {
          let newPlayer: Player = new Player(
            playerData.name,
            100,
            0,
            new Vector3(
              playerData[0].position.x,
              playerData[0].position.y,
              playerData[0].position.z
            ),
            new Vector3(
              playerData[0].position.x,
              playerData[0].position.y,
              playerData[0].position.z
            ),
            playerData.id,
            this._scene,
            { renderBody: true }
          );
          this._initPlayer(newPlayer);
          console.log(
            `Player doesn't exist, creating a new player with id ${playerData.id}`
          );
        } else if (playerData.id != this._player!.id) {
          let player: Player | undefined = this._players.get(playerData.id);
          player!.position = playerData[0].position;
          // player!.rotation = playerData[0].rotation;
          this._players.set(player!.id, player!);
          if (this._debug)
            document.getElementById(
              "pcount"
            )!.innerText = `Players online: ${this._players.size}`;
        } else if (playerData.id == this._player!.id) {
          this._player!.position = new Vector3(
            playerData.position._x,
            playerData.position._y,
            playerData.position._z
          );
        }
        this._castLookingRay();
        if (this._pickup == true) {
          document.getElementById("PickupItem")!.innerHTML = "pickup item";
        } else {
          document.getElementById("PickupItem")!.innerHTML = "";
        }
        // if(this.chestOpen == true){
        //     var material = new StandardMaterial("box color", this._scene);
        //     material.alpha = .5;
        //     material.diffuseColor = new Color3(0.2, 1, 0.2);
        //     let obox = MeshBuilder.CreateBox("obox", { size: 3, width: 3, height: 3}, this._scene)
        //     obox.metadata = "obox"
        //     obox.material = material; // <--
        //     this._entities.push(obox)
        //     }if(this.chestOpen == false ){
        //         this._entities.forEach((i)=>{
        //             if(i.metadata == "obox"){
        //                 i.dispose();
        //             }
        //         })
        //     }
        if (this._pickedup == true) {
          let ray = this._playerCamera!.getForwardRay();
          let item = this._scene.getMeshByUniqueId(this._itemchosen)
          item!.position = ray.origin.clone().add(ray.direction.scale(10));
        }
        break;
      case "Mesh":
        
        let uid = data.uid
        let payload = data.payload[0]
        
        if (state_machine.entities.has(uid)){
          let entity: Entities = state_machine.entities.get(uid)
          entity.update(payload.linearVelocity, payload.angularVelocity, payload.position)
          state_machine.update_entity(uid, entity)
        }else{
          let mesh: Mesh =  await this._generator.GENERATE[payload.metadata as "Cylinder" | "Box"](payload)

          let adjusted_pos: Vector3 = new Vector3(payload.position._x, payload.position._y * 2, payload.position._z)

          let mass: number = 90

          console.log(payload.metadata)

          let imposter = PhysicsImpostor.BoxImpostor
          if (payload.metdata == "Cylinder") imposter = PhysicsImpostor.CylinderImpostor
          else if (payload.metadata == "Tree") mass = 0
          let entity: Entities = createEntity(this._scene, uid, payload.name, adjusted_pos, mesh, imposter, mass, 0.1)
          entity.update(payload.linearVelocity, payload.angularVelocity, adjusted_pos)
          state_machine.add_entity(uid, entity)
        }
        break
        
        
      case "Info":
        let playerInfo: any = data?.payload[0];
        if (this._player === undefined) {
          console.log(playerInfo)
          this._initClient(playerInfo.name, data.uid);
        }
        // init player
        else break;
      case "Close":
        let player: Player | undefined = this._players.get(data.payload[0].id);
        if (player) player.delete();
        this._players.delete(data.payload[0].id);
        break;
      case "Interaction":
        let target: Player | MainPlayer | undefined;
        if (data.payload.target == this._player?.id) {
          target = this._player!;
        } else {
          target = this._players.get(data.payload.target);
        }
        switch (data.payload.type) {
          case "Damage":
            target?.damage(data.payload.magnitude);
            break;
          case "Heal":
            target?.heal(data.payload.magnitude);
            break;
        }
        console.log(target?.id, this._player?.id);
        console.log(target?.health);
        if (target?.id == this._player?.id) {
          this._hotbar.healthChange(target!.health);
        }

        break;
      case "Chat":
        this._chat?.receiveMessage(data.payload);
        break;
      default:
        // throw some error
        break;
    }
  }

  public get chat(): Chat | undefined {
    return this._chat;
  }
}
