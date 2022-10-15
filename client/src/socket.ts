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
      console.log('status is true')
    }
  }

  private listen() {
    this.server.onmessage = (event:any) => {
      const msg = JSON.parse(event.data)

      console.log(msg)

      switch (msg.type) {
        case "update":
          console.log(msg.payload)
          break
        case "info":
          console.log(msg.payload)
          break
        default:
          // throw some error
          break
      }
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
  payload: any
}

const server = new Socket()

server.send(<Message>{type: 'ping', payload: ['no plyload']})
server.send(<Message>{type: 'movement', payload: { position: { x: 5, y: 5, z: 5 }}})

console.log(server)
