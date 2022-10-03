import { Server } from 'ws'
import { World } from './world'

export class SocketServer {
  static readonly PORT: number = 2000
  private server: Server
  private port: number
  private world: World
  private players: Map<any, any>

  constructor() {
    this.players = new Map()

    this.init()
    this.listen()
  }

  private init() {
    this.world = new World()
    this.world.init()

    this.server = new Server({ port: SocketServer.PORT })
  }

  public setPlayerId(client:any, id:string) {
    this.players.set(client, id)
  }
  
  private listen() {
    console.log('Start listening on port: ' + SocketServer.PORT)

    this.server.on('connection', (client: any) => {
      // save client
      console.log('client connected')
      this.players.set(client, null)

      // basic starter functiosn
      client.on('message', (message:any) => {
        if (this.players.has(client)) {
          let playerId = this.players.get(client)
          let msg = JSON.parse(message)
          // do something in router
        }
      })

      client.on('close', () => {
        console.log('client connection closed')
        let id = this.players.get(client)
        this.world.removePlayer(id)
        this.players.delete(client)

        // close with router
      })

      client.on('error', () => {
        console.log('clienht connection threw an error')
      })
    })
  }

  public broadCast(data:string) {
    this.server.clients.forEach((client) => {
      if (this.players.get(client) !== null) {
        client.send(data)
      }
    });
  }
}