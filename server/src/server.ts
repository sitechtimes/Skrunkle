import { Server } from 'ws'
import { World } from './world'
import { Player } from './entity/player'
import { CubeMapToSphericalPolynomialTools, Vector3 } from 'babylonjs'
import { Router } from './router'
import { Packet, PacketType } from './packet'
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
        this.send(client, 
          new Packet(
            PacketType.info, 
            [{
              player: this.players.get(client),
              players: this.players.size 
            }]
          )
        )
      }

      // basic starter functiosn
      client.on('message', (message:any) => {
        if (this.players.has(client)) {
          let playerId = this.players.get(client)
          let msg = JSON.parse(message)

          let player: Player = this.players.get(client)
          
          switch (msg.type) {
            case "movement":
              this.logger.log(`Received Movement from client ${msg.payload.id}`)
              // player.position = new Vector3(msg.payload.position.x, msg.payload.position.y, msg.payload.position.z)
              // this.send(client, new Packet(PacketType.update, [player]))
              player.position = msg.payload[0].position
              this.broadCast(client, new Packet(PacketType.update, msg.payload[0]))
              break
            case "ping":
              this.logger.log("Received Ping from client. Pong!")
              this.send(client, new Packet(PacketType.info, ['Pong!']))
            default:
              this.logger.error(`Unknown socket message from client (${msg.type})`)
              break
          }
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

  private send(client:any, packet:Packet) {
    client.send(
      JSON.stringify(packet)
    )
  }

  public broadCast(client:any, packet:Packet) {
    this.server.clients.forEach((user) => {
      if (this.players.get(user) !== null && client !== user) {
        this.send(user, packet)
      }
    });
  }
}