import { Server } from 'ws'
import { World } from './world'
import { Player } from './entity/player'
import { CubeMapToSphericalPolynomialTools, Vector3 } from 'babylonjs'
import { Router } from './router'
import { Packet, PacketType } from './packet'
import { Logger } from './logger'
import { v4 as uuidv4 } from 'uuid';

export class SocketServer {
  static readonly PORT: number = 2000
  private server: Server
  private world: World
  private logger: Logger

  constructor() {
    this.world = new World(this)
    this.logger = new Logger('Socket')
    this.server = new Server({ port: SocketServer.PORT })

    this.init()
    this.listen()
  }

  private init() {
    this.world.init()
  }

  public setPlayer(uid:string, player:Player) {
    this.world.players.set(uid, player)
  }
  
  private listen() {
    this.logger.progress('Start listening on port: ' + SocketServer.PORT)

    this.server.on('connection', (client: any) => {
      // save client
      this.logger.log('Client connected')
      if(!this.world.players.has(client)) {
        let playerid: string = uuidv4()
        let player: Player = this.world.add_players(playerid)
        this.send(client, 
          new Packet(
            PacketType.info, 
            [{
              player: player.serialize(),
              players: this.world.players.size 
            }],
            player.id
          )
        )
        this.send(client,
          new Packet(
            PacketType.mesh,
            this.world._array_entities()
          )
        )
      }

      // basic starter functiosn
      client.on('message', (message:string) => {
        let msg: Packet = JSON.parse(message)
        if (this.world.players.has(msg.uid)) {

          let player: Player = this.world.players.get(msg.uid)
          
          switch (msg.type) {
            case "Movement":
              // this.logger.log(`Received Movement from client ${msg.payload[0].id}`)
              // player.position = new Vector3(msg.payload.position.x, msg.payload.position.y, msg.payload.position.z)
              // this.send(client, new Packet(PacketType.update, [player]))
              if (player !== null) {
                player.position = this.world.validateEntityPosition(new Vector3(msg.payload[0].position._x, msg.payload[0].position._y, msg.payload[0].position._z))
                msg.payload[0].position = player.position
                this.world.update_player(msg.uid, player)
                let updatePacket = new Packet(PacketType.update, msg.payload[0], player.id)
                updatePacket.uid = msg.uid
                this.broadCast(updatePacket)
              }
              break
            case "Impulse":
              this.world.move_player(msg.uid, msg.payload[0].impulse)
              break
            case "Info":
              this.setPlayer(msg.uid, msg.payload[0])
              this.broadCast(new Packet(PacketType.info, msg.payload[0]))
              break
            case "Close":
              this.world.players.delete(msg.uid)
              this.world.players.delete(msg.uid)
              this.broadCast(new Packet(PacketType.close, [{id: msg.uid, delete: true}]))
              break
            case "Interaction":
              this.logger.log("Received interaction")
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
        // this.world.removePlayer(id)
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

  public broadCast(packet:Packet) {
    this.server.clients.forEach((user) => {
      if (this.world.players.get(user) !== null) {
        this.send(user, packet)
      }
    });
  }
}