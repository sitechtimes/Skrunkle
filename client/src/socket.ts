import { World } from "./world/world";

export class Socket {
  static readonly url: string = 'ws://localhost:2000'
  private server: any
  private status: boolean = false
  private worldReference: World;

  constructor(world: World) {
    this.server = new WebSocket(Socket.url)
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

  public send(message: Message) {
    if (this.status === true) {
      this.server.send(JSON.stringify(message))
    } else {
      setTimeout(() => this.send(message), 500)
    }
  }

  public close() {
    this.server.close()
  }
}

export interface Message {
  type: string,
  payload: Array<any>
}
