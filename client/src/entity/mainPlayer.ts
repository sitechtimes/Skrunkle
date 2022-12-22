import { Vector3, UniversalCamera, Mesh, Scene, FreeCamera, MeshBuilder, Camera, FreeCameraKeyboardMoveInput  } from "@babylonjs/core"
import { Socket } from "../socket";
import { Packet, PacketType } from "../packet";
import { Player } from "./player"

const handleFreeCameraInputs = new FreeCameraKeyboardMoveInput().checkInputs

class CustomInput extends FreeCameraKeyboardMoveInput {     
    
    onKeyDown = false;
    keysUp    = [87]; // W
    keysDown  = [83]; // A
    keysLeft  = [65]; // S
    keysRight = [68]; // D

    private changeX = 0;
    private changeZ = 0;
    private change = 1;

    private playerReference: MainPlayer;
    private socketReference: Socket;

    constructor(mainPlayer: MainPlayer, socket: Socket){
        super()
        this.init(document)
        this.playerReference = mainPlayer
        this.socketReference = socket
    }

    init(element: any): void{

        const handleKeyDown = (event:any)=>{

            let rotation:number = this.camera.rotation.y

            let left: boolean = false
            let front: boolean = false

            let sin = Math.sin(rotation);
            let cos = Math.cos(rotation);
            let tan = Math.tan(rotation);

            //                              0
            //                              |
            //                              |
            //                              |
            //                              |
            // (1.5pi / -0.5pi) - - - - - - - - - - - - - (0.5pi)
            //                              |
            //                              |
            //                              |
            //                              |
            //                              pi

            if (sin > 0 && cos > 0 && tan > 0){
                console.log("A")
            } else if ()

            if (!left && front) console.log("1") // top right
            else if (!left && !front) console.log("2") // bottom right
            else if (left && !front) console.log("3") // left bottom
            else if (left && front) console.log("4") // top left
            
            if (event.keyCode == 87) this.changeX = -this.change;
            else if (event.keyCode == 65) this.changeZ = -this.change;
            else if (event.keyCode == 83) this.changeX = this.change;
            else if (event.keyCode == 68) this.changeZ = this.change;
            
        }
        
        const handleKeyUp = (event: any)=>{
            this.changeX = 0;
            this.changeZ = 0
        }
        
        element.addEventListener("keydown", handleKeyDown, false);
        element.addEventListener("keyup", handleKeyUp, false);
        
        console.log("init")
    }
    
    checkInputs(): void {
        // this.playerReference._calculateForce()
        if (this.playerReference && this.socketReference){
            // console.log(`change x: ${this.changeX}, change z: ${this.changeZ}`)
            let movementDirection: Vector3 = new Vector3(this.changeX, 0, this.changeZ)
            this.socketReference.send(new Packet(PacketType.impulse, [{impulse: movementDirection}], this.playerReference.id))
        }
        // handleFreeCameraInputs.apply(this)
    }
}

export class MainPlayer extends Player {

    private _camera: FreeCamera;
    private _canvas: HTMLCanvasElement
    private _old_position: Vector3;
    private _socket: Socket

    constructor(
        name: string,
        health: number,
        exp: number,
        position: Vector3,
        rotation: Vector3,
        id: string,
        scene: Scene,
        canvas: HTMLCanvasElement,
        freeCamera: FreeCamera,
        socket: Socket
    ) {
        super(name, health, exp, position, rotation, id, scene, {renderBody: false, mainPlayer: true});

        this._canvas = canvas;
        this._socket = socket
        // this.scene.gravity = new Vector3(0, -9.81, 0);

        this._camera = freeCamera;
        this._camera.attachControl(canvas, true);
        this._camera.ellipsoid = new Vector3(2, 4, 2); // body size
        this._camera.inertia = 0.5;
        this._camera.checkCollisions = true;
        // this._camera.applyGravity = true;
        // (<any>this._camera)._needMoveForGravity = true;

        this._old_position = this.position

        this._createPointerLock()

        // this._camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        
        
        this._camera.inputs.removeByType("FreeCameraKeyboardMoveInput")
        this._camera.inputs.add(new CustomInput(this, this._socket))
        console.log(this._camera.inputs.attached)

        console.log(this._camera.inputs.attached)
        
    }

    public _calculateForce(): void{
        console.log(this.position)
        if (this.position){
            let impulseDirection: Vector3 = new Vector3(this.position.x - this._old_position.x, this.position.y - this._old_position.y, this.position.z - this._old_position.z)
            console.log(impulseDirection);
            this._old_position = this.position
            this._socket.send(new Packet(PacketType.impulse, [{impulse: impulseDirection}], this.id))
        }
    }

    private _createPointerLock(): void{
        if (this._canvas){
            this._canvas.addEventListener("click", event => {
                this._canvas.requestPointerLock = this._canvas.requestPointerLock || this._canvas.msRequestPointerLock || this._canvas.mozRequestPointerLock || this._canvas.webkitRequestPointerLock;
                if(this._canvas.requestPointerLock) {
                  this._canvas.requestPointerLock();
                }
            }, false);
        }
    }

    public get position(): Vector3{
        return this._camera.position;
    }

    public set position(new_position: Vector3){
        this._camera.position = new_position;
    }

    public get rotation(): Vector3{
        return this._camera.rotation
    }

    /* public set id(new_id: string){
        this.id = new_id;
    } */
}