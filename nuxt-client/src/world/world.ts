import {
  Scene,
  Engine,
  Vector3,
  MeshBuilder,
  HemisphericLight,
  Sound,
  CubeTexture,
  FreeCamera,
  StandardMaterial,
  Matrix,
  KeyboardEventTypes,
  AbstractMesh,
  PhysicsImpostor,
  Color3,
  Texture,
  DebugLayer,
  PointLight,
  Mesh,
  OimoJSPlugin,
  Quaternion,
  SceneOptimizerOptions,
  HardwareScalingOptimization,
  SceneOptimizer,
  WebXRSessionManager,
  WebXRCamera,
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { MainPlayer } from "../entity/mainPlayer";
// import * as cannon from "cannon-es";
import * as OIMO from "oimo";
// import * as Ammo from "@enable3d/ammo-physics"
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
  private env: any;
  private _engine: Engine;
  private _scene: Scene;
  private _optimizer: SceneOptimizer;
  private _canvas: HTMLCanvasElement | null;
  private _playerCamera: FreeCamera | WebXRCamera | null = null;
  private _entities: any[] = [];
  private _socket: Socket;
  private _player: MainPlayer | undefined;
  private _players: Map<string, Player>;
  private _GUI: GUI;
  // @ts-expect-error
  private _hotbar: Hotbar;
  private _debug: boolean = false;
  public chestOpen: boolean;
  private _pickup: boolean;
  private _pickedup: boolean;
  // @ts-expect-error
  private _testMaterial: StandardMaterial;
  private _generator: Generation;
  private _chat: Chat | undefined;
  private _itemchosen: number;
  private _isday: boolean = true;
  private _alpha_time: number = 0

  private _skyboxMaterial: StandardMaterial;
  private _day_material: CubeTexture;
  private _night_material: CubeTexture;

  private _ground_size:any = {width: 10000, height: 10000}
  
  // loading & process
  private _processing_mesh: Map<string, boolean> = new Map();
  private _total_meshes: number = 1e10;
  private _current_meshes: number = 0;

  private _load_callback: any;

  /* VR INTEGRATION */
  private _sessionManager: WebXRSessionManager;
  private _vr: boolean = false;

  constructor(canvas: HTMLCanvasElement | null, env: any, call_back: any) {
    this.env = env;
    this._load_callback = call_back

    this._canvas = canvas;
    this._engine = new Engine(this._canvas);
    this._scene = new Scene(this._engine);
    this._GUI = new GUI(this._scene);
    this._players = new Map<string, Player>();
    this._socket = new Socket(this, this.env);
    this._chat = new Chat(this._socket, this._player!);
    this._generator = new Generation(this, this._scene, this.env);
    this._testMaterial = new StandardMaterial("_testMaterial", this._scene);
    this.chestOpen = false;
    this._pickup = false;
    this._pickedup = false;
    this._itemchosen = 0;

    // this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, cannon));
    this._scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new OimoJSPlugin(true, 10, OIMO)
    );

    let options = new SceneOptimizerOptions(120, 500);
    SceneOptimizerOptions.ModerateDegradationAllowed(120)
    options.addOptimization(new HardwareScalingOptimization(0, 1))
    this._optimizer = new SceneOptimizer(this._scene, options)
    SceneOptimizer.OptimizeAsync(this._scene)

    this._sessionManager = new WebXRSessionManager(this._scene);

    // this._scene.enablePhysics(new Vector3(0, -9.81, 0), new AmmoJSPlugin(true, 10, Ammo));
  }

  public resize(): void{
    this._engine.resize()
  }

  private _renderLoop(): void{
    this._scene.render()
  }

  private async _initCamera(): Promise<void> {

    const supported = await this._sessionManager.isSessionSupportedAsync('immersive-vr');
    if (supported) {
      // xr available, session supported
      console.log("Is VR")
      this._vr = true;

      await this._sessionManager.initializeAsync()
      await this._sessionManager.initializeSessionAsync('immersive-vr' /*, xrSessionInit */ );
      const referenceSpace = await this._sessionManager.setReferenceSpaceTypeAsync('local');
      const renderTarget = this._sessionManager.getWebXRRenderTarget( /*outputCanvasOptions: WebXRManagedOutputCanvasOptions*/ );
      const xrWebGLLayer = await renderTarget.initializeXRLayerAsync(this._sessionManager.session);

      this._playerCamera = new WebXRCamera("PlayerCamera", this._scene, this._sessionManager);
      const xrHelper = await this._scene.createDefaultXRExperienceAsync({
        optionalFeatures: true,
      });
      
      // this._playerCamera = xrHelper.baseExperience.camera;

      const userHeight = this._playerCamera.realWorldHeight;
      this._playerCamera.position.y = userHeight

      this._sessionManager.runXRRenderLoop()


    }else{
      console.log("Not VR")
      this._playerCamera = new FreeCamera(
        "FreeCamera",
        new Vector3(0, 6, 0),
        this._scene
      );
      this._playerCamera.checkCollisions = true;
      this._scene.collisionsEnabled = true;
      this._playerCamera.applyGravity = true;
      this._playerCamera.speed = 15;
      this._playerCamera.angularSensibility = 1500;
      
      this._playerCamera.ellipsoid = new Vector3(1, 4, 1);
    }

    

    // document.addEventListener('keydown', (event) => {
    //   if (event.code === 'Space') {
    //     // Apply a vertical impulse to the camera's physics impostor
    //     this._playerCamera.applyImpulse(new BABYLON.Vector3(0, 20, 0), this._playerCamera.position);
    //   }
    // });
  }

  public async init(): void {
    this._scene.useRightHandedSystem = true;
    // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
    var ground = MeshBuilder.CreateGround(
      "ground",
      { width: this._ground_size.width, height: this._ground_size.height },
      this._scene
    );
    ground.position = new Vector3(0, 0, 0);
    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0 },
      this._scene
    );
    ground.checkCollisions = true;
    ground.receiveShadows = true;

    let ground_material = new StandardMaterial("ground", this._scene);
    // ground_material.albedoColor = new Color3(1, 0 ,0)

    // ground_material.ambientTexture = new Texture("http://localhost:3001/static/textures/polygrass/grass_color.jpg", this._scene)
    // ground_material.ambientTexture.uScale = this._ground_size.width/15
    // ground_material.ambientTexture.vScale = this._ground_size.height/15

    ground_material.diffuseTexture = new Texture(
      `${this.env["CMS"]}/textures/grass/grass_color.jpg`,
      this._scene
    );
    ground_material.diffuseTexture.uScale = this._ground_size.width / 10;
    ground_material.diffuseTexture.vScale = this._ground_size.height / 10;

    ground_material.ambientTexture = new Texture(
      `${this.env["CMS"]}/textures/grass/grass_ambient.jpg`,
      this._scene
    );
    ground_material.ambientTexture.uScale = this._ground_size.width / 10;
    ground_material.ambientTexture.vScale = this._ground_size.height / 10;

    ground_material.bumpTexture = new Texture(
      `${this.env["CMS"]}/textures/grass/grass_normal.jpg`,
      this._scene
    );
    ground_material.bumpTexture.uScale = this._ground_size.width / 10;
    ground_material.bumpTexture.vScale = this._ground_size.height / 10;

    // ground_material.microSurfaceTexture = new Texture("http://localhost:3001/static/textures/polygrass/grass_roughness.jpg", this._scene)
    // ground_material.microSurfaceTexture.uScale = this._ground_size.width/15
    // ground_material.microSurfaceTexture.vScale = this._ground_size.height/15

    ground.material = ground_material;

    const volume = 0.4;
    const music = new Sound(
      "Walking Music",
      `${this.env["CMS"]}/audio/walking.wav`,
      this._scene,
      null,
      {
        loop: true,
        autoplay: true,
        volume: volume,
      }
    );
    music.setVolume(volume);

    const steps = new Sound(
      "Walking Steps",
      `${this.env["CMS"]}/audio/step.ogg`,
      this._scene
    );
    window.addEventListener("keydown", function (evt) {
      // Press space key to fire
      if (["w", "a", "s", "d"].includes(evt.key)) {
        if (!steps.isPlaying) steps.play();
      }
    });

    const windOne = new Sound(
      "wind1",
      `${this.env["CMS"]}/audio/Wind.ogg`,
      this._scene
    );
    setInterval(() => windOne.play(), Math.random() * 1000 + 30000);

    const windTwo = new Sound(
      "wind2",
      `${this.env["CMS"]}/audio/Wind2.ogg`,
      this._scene
    );
    setInterval(() => windTwo.play(), Math.random() * 1000 + 62000);

    const windThree = new Sound(
      "wind3",
      `${this.env["CMS"]}/audio/Wind3.ogg`,
      this._scene
    );

    setInterval(() => windThree.play(), Math.random() * 1000 + 1000000);
    
    // Adds the sun and moon
    var ambient_light = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), this._scene)
    ambient_light.diffuse = new Color3(0.1, 0.1, 0.1)
    ambient_light.groundColor = new Color3(0, 0, 0)

    var sun_light = new PointLight("sun", new Vector3(10, 0, 0), this._scene);
    sun_light.intensity = 1;
    var moon_light = new PointLight("moon", new Vector3(10, 0, 0), this._scene);
    moon_light.intensity = 0.01;

    var smooth_material = new StandardMaterial(
      "sun/moon material",
      this._scene
    );

    // Creating light sphere

    var sun = <any>Mesh.CreateSphere("Sphere2", 12, 10, this._scene);
    var moon = <any>Mesh.CreateSphere("Sphere2", 12, 20, this._scene);

    sun.material = new StandardMaterial("sun material", this._scene);
    sun.material.diffuseColor = new Color3(0, 0, 0);
    sun.material.specularColor = new Color3(0, 0, 0);
    sun.material.emissiveColor = new Color3(1, 1, 0);

    moon.material = new StandardMaterial("moon material", this._scene);
    moon.material.diffuseColor = new Color3(0, 0, 0);
    moon.material.specularColor = new Color3(0, 0, 0);
    moon.material.emissiveColor = new Color3(255, 255, 255);

    // Sphere material
    smooth_material.diffuseColor = new Color3(0, 1, 0);

    // Lights colors

    sun_light.diffuse = new Color3(1, 1, 0);
    sun_light.specular = new Color3(1, 1, 0);
    moon_light.diffuse = new Color3(31, 30, 30);
    moon_light.specular = new Color3(31, 30, 30);

    var skybox = MeshBuilder.CreateBox("skyBox", { size: 10000 }, this._scene);
    this._skyboxMaterial = new StandardMaterial("skyBox", this._scene);
    this._skyboxMaterial.backFaceCulling = false;
    this._day_material = new CubeTexture(
      `${this.env["CMS"]}/sky/TropicalSunnyDay`,
      this._scene
    );
    this._night_material = new CubeTexture(
      `${this.env["CMS"]}/space/space`,
      this._scene
    );
    this._skyboxMaterial.reflectionTexture = this._day_material;
    this._skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    this._skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    this._skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = this._skyboxMaterial;

    // Animations
    this._scene.beforeRender = () => {
      sun_light.position = new Vector3(
        900 * Math.sin(this._alpha_time),
        900 * Math.cos(this._alpha_time),
        0
      );
      moon_light.position = new Vector3(
        900 * -Math.sin(this._alpha_time),
        900 * -Math.cos(this._alpha_time),
        0
      );
      skybox.rotation.y += 0.0008;
      sun.position = sun_light.position;
      moon.position = moon_light.position;

      this._alpha_time += (0.05 * this._scene.deltaTime) / 1000;

      this._alpha_time = this._alpha_time % (2 * Math.PI); // keeps alpha always between 0 - 2PI

      if (Math.cos(this._alpha_time) > 0 && !this._isday){
        this._isday = true
        this._skyboxMaterial.reflectionTexture = this._day_material;
      }else if (Math.cos(this._alpha_time) < 0 && this._isday){
        this._isday = false
        this._skyboxMaterial.reflectionTexture = this._night_material;
      }

    };

    state_machine.setShadowGenerator(sun_light, sun_light, moon_light);
    // state_machine.applyShadow(ground)
    
    await import("@babylonjs/core/Debug/debugLayer")
    await import("@babylonjs/inspector")
    const debuglayer = new DebugLayer(this._scene)

    debuglayer.show({
      overlay: true,
      handleResize: true,
      overlayCanvas: true,
      embedMode: true,
      parentElement: document.body,
      initialTab: "Physics", // <-- This enables the Physics tab,
    });
    
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

    // setTimeout(this._socket.init(), 10000)
    this._scene.executeWhenReady(async () => {
      await this._socket.init();
      state_machine.setSocket(this._socket);
      console.log("Scene is ready");
      // TODO: Find out a way to avoid circular JSON error below. This never used to happen
      // let {_scene, ...bodyRef} = this._player!._body
      // this._socket.send(new Packet(PacketType.info, [{id: this._player!.id, _body: bodyRef}], ""));
      await this._initCamera();

      this._engine.runRenderLoop(()=>{
        this._renderLoop()
      })

      // this._engine.runRenderLoop(() => {
      //   state_machine.check_entity();


      //   state_machine.check_entity();

      //   this._scene.render();
      //   if (this._player) {
      //     this._socket?.send(
      //       new Packet(
      //         PacketType.movement,
      //         [
      //           {
      //             id: this._player.id,
      //             name: this._player.name,
      //             position: this._player.position,
      //             rotation: Quaternion.FromEulerAngles(
      //               this._player.rotation.x,
      //               this._player.rotation.y,
      //               this._player.rotation.z
      //             ),
      //             current: this._hotbar.current,
      //           },
      //         ],
      //         this._player.id
      //       )
      //     );
      //     if (this._debug) {
      //       document.getElementById(
      //         "x"
      //       )!.innerText = `X: ${this._player.position.x}`;
      //       document.getElementById(
      //         "y"
      //       )!.innerText = `Y: ${this._player.position.y}`;
      //       document.getElementById(
      //         "z"
      //       )!.innerText = `Z: ${this._player.position.z}`;
      //     }
      //   }
      // });
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
    if (!hit?.pickedMesh) return;
    if (
      (hit!.pickedMesh != null && hit!.pickedMesh.metadata == "item") ||
      hit!.pickedMesh!.metadata == "Cylinder" ||
      hit!.pickedMesh!.metadata == "Box"
    ) {
      console.log("hit");
      this._pickup = true;

      if (hit!.pickedMesh!.name != "ground") {
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
                if (this._debug)
                  document.getElementById("PickedupItem")!.innerHTML =
                    "Picked Up";
              }
              break;
          }
        });
      } else {
        this._pickup = false;
      }
    }
  }
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
    console.log(this._player);
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
        let playerData = data.payload[0];
        let playerid = data.uid;

        if (!this._players.has(playerid) && playerid != this._player!.id) {
          let newPlayer: Player = new Player(
            playerData.name,
            100,
            0,
            new Vector3(
              playerData.position.x,
              playerData.position.y,
              playerData.position.z
            ),
            new Vector3(
              playerData.position.x,
              playerData.position.y,
              playerData.position.z
            ),
            playerid,
            this._scene,
            { renderBody: true },
            this.env
          );
          this._initPlayer(newPlayer);
          console.log(
            `Player doesn't exist, creating a new player with id ${playerid}`
          );
        } else if (playerid != this._player!.id) {
          let player: Player | undefined = this._players.get(playerid);
          player!.position = playerData.position;
          player!.rotation = playerData.rotation;
          // player!.rotation = playerData[0].rotation;
          this._players.set(player!.id, player!);
          if (this._debug)
            document.getElementById(
              "pcount"
            )!.innerText = `Players online: ${this._players.size}`;
        } else if (playerid == this._player!.id) {
          // this means that it is the main player, adding this will lag the player as it basically updates itself
          // PLEASE THINK OF A WAY FOR SERVER TO SET PLAYER POS WTIHOUT CONSTANT UPDATE
          // this._player!.position = new Vector3(
          //   playerData.position._x,
          //   playerData.position._y,
          //   playerData.position._z
          // );
        }
        this._castLookingRay();
        if (this._pickup == true) {
          if (this._debug)
            document.getElementById("PickupItem")!.innerHTML = "pickup item";
        } else {
          if (this._debug)
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
          let item = this._scene.getMeshByUniqueId(this._itemchosen);
          item!.position = ray.origin.clone().add(ray.direction.scale(10));
        }
        break;
      case "Mesh":
        let uid = data.uid;
        let payload = data.payload[0];

        if (state_machine.entities.has(uid)) {
          let entity: Entities = state_machine.entities.get(uid);
          entity.update(
            payload.linearVelocity,
            payload.angularVelocity,
            payload.position,
            payload.rotation
          );
          state_machine.update_entity(uid, entity);
        } else {
          if (this._processing_mesh.get(uid)) return
          this._processing_mesh.set(uid, true)
          let mesh: Mesh = await this._generator.GENERATE[
            payload.metadata as "Cylinder" | "Box" | "Tree1" | "Tree2" | "House" | "House2" | "Sheep" | "Slope" | "Fountain"
          ](payload, uid);
          this._current_meshes++;
          this._processing_mesh.delete(uid)
          this._load_callback(this._current_meshes, this._total_meshes, "meshes")
        }
        break;

      case "Info":
        // pls implement update to info like server info
        // init player
        break;
      case "PlayerCreation":
        let playerInfo: any = data?.payload[0];
        if (this._player === undefined) {
          this._total_meshes = playerInfo.total_mesh
          this._initClient(playerInfo.name, data.uid);
          this._isday = playerInfo.isday;
          this._alpha_time = playerInfo.alpha_time

          if (this._isday) this._skyboxMaterial.reflectionTexture = this._day_material
          else this._skyboxMaterial.reflectionTexture = this._night_material

          this._load_callback(this._current_meshes, this._total_meshes, "server")
        }
        break;
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

  public second_decimal(n: number): number {
    return Math.round(n * 100) / 100;
  }
}
