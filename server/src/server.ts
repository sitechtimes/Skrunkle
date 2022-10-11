import { Server } from 'ws'
import { World } from './world'
import { Player } from './entity/player'
import { CubeMapToSphericalPolynomialTools, Vector3 } from 'babylonjs'
import { Router } from './router'
import { Packet, PacketType } from "./packet"
import { Logger } from './logger'

export class SocketServer {
  static readonly PORT: number = 2000
  private server: Server
  private world: World
  private logger: Logger
  private players: Map<any, any>

  constructor() {
    this.players = new Map()
    this.world = new World()
    this.logger = new Logger('Socket')
    this.server = new Server({ port: SocketServer.PORT })

    this.init()
    this.listen()
  }

  private init() {
    this.world.init()
  }

  public setPlayer(client:any, player:Player) {
    this.players.set(client, player)
  }
  
  private listen() {
    this.logger.progress('Start listening on port: ' + SocketServer.PORT)

    this.server.on('connection', (client: any) => {
      // save client
      this.logger.log('Client connected')
      if(!this.players.has(client)) {
        this.setPlayer(client, new Player())
        client.send(
          JSON.stringify(
            new Packet(
              PacketType.info, 
              {
                player: this.players.get(client),
                players: this.players.size 
              }
            )
          )
        )
      }

      // basic starter functiosn
      client.on('message', (message:any) => {
        if (this.players.has(client)) {
          let playerId = this.players.get(client)
          let msg = JSON.parse(message)
          // do something in router
        }
      })

      client.on('close', () => {
        this.logger.log('Client connection closed')
        let id = this.players.get(client)
        // this.world.removePlayer(id)
        this.players.delete(client)

        // close with router
      })

      client.on('error', () => {
        this.logger.error('Client connection threw an error')
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