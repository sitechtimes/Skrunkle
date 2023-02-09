import { MainPlayer } from "../entity/mainPlayer";
import { Packet, PacketType } from "../packet";
import { Socket } from "../socket";


export class Chat {
  private _socket: Socket
  private _player: MainPlayer
  private _chatWindow: HTMLDivElement

  constructor(socket: Socket, player: MainPlayer) {
    this._socket = socket
    this._player = player
    this._chatWindow = <HTMLDivElement>document.getElementById("chat")
  }
  
  public toggleChat() {
    this._chatWindow.style.display = "none"
  }

  public sendMessage() {
    this._socket.send(new Packet(PacketType.chat, [], this._player.id))
  }

  public receiveMessage() {

  }
}