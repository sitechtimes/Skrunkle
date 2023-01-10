import { Scene, Engine, NullEngine, CannonJSPlugin, Vector3, ArcRotateCamera, MeshBuilder, Mesh, PhysicsImpostor, GroundMesh } from 'babylonjs';
import { Logger } from './logger';
import { Entities } from './entity/entities';
import { v4 as uuidv4 } from 'uuid';
import * as cannon from "cannon-es";
import { SocketServer } from './server';
import { Packet, PacketType } from './packet';

interface worldSize {
    top: Vector3,
    bottom: Vector3
}

export class World{
    private _engine: Engine;
    private _socket: SocketServer;
    private _scene: Scene;
    private _tick_time: number = 5000; // in ms
    private _ticks_elapsed: number = 0;
    private _entities: Map<string, Entities> = new Map();
    private _ground: GroundMesh;
    private logger: Logger = new Logger('World');
    private worldSize: worldSize = { top: new Vector3(50, 50, 50), bottom: new Vector3(-50, 0, -50)};
    public players: Map<string, any> = new Map()
    public box: any;
    
    constructor(socket: SocketServer){
        this._engine = new NullEngine();
        this._scene = new Scene(this._engine);
        this._socket = socket;

        this._scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, cannon));
        
        this.box =  MeshBuilder.CreateBox("box", { size: 2, height: 2, width: 2}, this._scene)
        this.box.physicsImposter =  new PhysicsImpostor(this.box, PhysicsImpostor.BoxImpostor, { mass: 90, restitution: 0.9 }, this._scene);


        this._entities.set(`M-${uuidv4()}`, new Entities("Box test", new Vector3(0, 100, 0), this.box))

        this._ground = MeshBuilder.CreateGround("ground", {width: 100, height: 100}, this._scene);
        // this._ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        this._ground.physicsImpostor = new PhysicsImpostor(this._ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this._scene)

        // console.log(this._ground.position)
    }

    private get _get_tick(): number{
        let ticks = Math.round(this._ticks_elapsed/this._tick_time * 1000);
        this._ticks_elapsed = 0;
        return ticks;
    }

    public validateEntityPosition(entityPosition: Vector3): Vector3{
        if (
            (entityPosition.x < this.worldSize.bottom.x || entityPosition.x > this.worldSize.top.x) ||
            (entityPosition.y < this.worldSize.bottom.y || entityPosition.y > this.worldSize.top.y) ||
            (entityPosition.z < this.worldSize.bottom.z || entityPosition.z > this.worldSize.top.z) 
        ) {
            console.log("EXCEEDED LIMITS: " + entityPosition + " compared to " +  this.worldSize.bottom + " and " + this.worldSize.top)
            return new Vector3(0, 10, 0);
        }
        else return entityPosition;
    }

    public init(): void{
        // Camera is absolutely needed, for some reason BabylonJS requires a camera for Server or will crash
        var camera:ArcRotateCamera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), this._scene); 

        // this._scene.enablePhysics(new Vector3(0, -9.81, 0), new OimoJSPlugin());

        this._scene.executeWhenReady(()=>{

            this.logger.progress("Scene is ready, running server side simulation");

            this._engine.runRenderLoop(()=>{
                this._scene.render();
                this._ticks_elapsed++;

                // if (Array.from(this.players.keys()).length > 0) console.log(this.players.get(Array.from(this.players.keys())[0]).position)

                this._updateEntities()

                // console.log(`${this._entities.get(Array.from(this._entities.keys())[0])?.position.y} - ${this.box.position.y}`)
            })

        })

        this.logger.interval_logger(this._tick_time, ()=>{
            this.logger.progress(`Avg Server tick (${this._tick_time} ms): ${this._get_tick}`)
        })
        
    }

    public _updateEntities(): void{
        for (let [key, value] of this._entities){
            let updatePacket: Packet = new Packet(PacketType.update, [{position: value.position}])
            updatePacket.uid = key;
            this._socket.broadCast(updatePacket)
        }
    }

    public add_players(id: string): void{
        let playerMesh: any = MeshBuilder.CreateBox(id, {size: 2, width: 2, height: 4}, this._scene)
        playerMesh.position = new Vector3(0, 5, 0)
        playerMesh.physicsImposter = new PhysicsImpostor(playerMesh, PhysicsImpostor.BoxImpostor, { mass: 90, restitution: 1 }, this._scene);
        this.players.set(id, playerMesh)
    }

    public update_player(id: string, value: any): void{
        this.players.set(id, value)
    }

    public delete_player(id: string): void{
        this.players.delete(id)
    }

    public _array_entities(): any[]{
        const data: any = []
        for (const [key, value] of this._entities) data.push({position: value.position})
        console.log(data)
        return data
    }

    public move_player(id: string, change_vector: Vector3): void{

        const scale = 0.5
        let playerMesh: Mesh | undefined = this.players.get(id)
        
        playerMesh!.position.x += change_vector._x * scale
        playerMesh!.position.y += change_vector._y * scale
        playerMesh!.position.z += change_vector._z * scale
    }
    
}