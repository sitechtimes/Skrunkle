import type { World } from "./world/world";
import { Packet, PacketType } from "./packet";

export class Socket {
  static readonly url: string = 'ws://10.94.168.208:2000'
  private server: any
  private status: boolean = false
  private worldReference: World;

  constructor(world: World) {
    this.server = new WebSocket(Socket.url, "tcp")
    this.worldReference = world;
    this.init()
    this.listen()
  }
  
  private init() {
    this.server.onopen = () => {
      this.status = true
    }
  }

  private listen() {
    this.server.onmessage = (event:any) => {
      const msg = JSON.parse(event.data)
      this.worldReference.onSocketData(msg);
    }
  }

  public send(packet: Packet) {
    if (this.status === true) {
      this.server.send(JSON.stringify(packet))
    } else {
      setTimeout(() => this.send(packet), 50)
    }
  }

  public close(uid: string) {
    this.send(new Packet(PacketType.close, [{id: uid, delete: true}], uid))
    this.server.close(uid)
  }
}