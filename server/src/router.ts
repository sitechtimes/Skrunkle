import { World } from './world'
import { SocketServer } from './server'

export namespace Router {
  export let world:World
  export let server:SocketServer

  let messageMap:{ [key:string]: Function } = {
    "player_interaction": recieveInteraction,
    "init_game_state": initPlayer,
    "ping": sendPong
  }

  export function routeMessage(msg:any, client:WebSocket, playerId:string) {
    if (messageMap[msg.type] !== undefined) {
      messageMap[msg.type](msg.msg, playerId, client, msg.origin, msg.id)
    }
  }

  function recieveInteraction(data:any, playerId:string) {
    // world.applyMovement
  }

  function sendPong() {}

  function initPlayer() {

  }
}
