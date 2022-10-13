export class Socket {
  static readonly url: string = 'ws://localhost:2000'
  private server: any
  private status: boolean = false

  constructor() {
    this.server = new WebSocket(Socket.url)
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

      switch (msg.type) {
        case "world-update":
          // update world
          break
        case "player-update":
          // update players
          break
        default:
          // throw some error
          break
      }
    }
  }

  public send(message: Message) {
    if (!this.status) this.server.send(JSON.stringify(message))
    else this.send(message)
    // just try again until good
  }

  public close() {
    this.server.close()
  }
}

export interface Message {
  type: string,
  payload: any
}