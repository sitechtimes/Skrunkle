import { MainPlayer } from "../entity/mainPlayer";
import { Packet, PacketType } from "../packet";
import { Socket } from "../socket";


export class Chat {
  private _socket: Socket
  private _player: MainPlayer
  private _chatWindow: HTMLDivElement
  private _messages: ChatMessage[] = []

  constructor(socket: Socket, player: MainPlayer) {
    this._socket = socket
    this._player = player
    this._chatWindow = <HTMLDivElement>document.getElementById("chat")
  }
  
  public toggleChat() {
    // you can alter the css with this if you want
    this._chatWindow.style.display = "none"
  }

  public sendMessage(msg: string) {
    this._socket.send(new Packet(PacketType.chat, [<ChatMessage>{ msg: msg, name: this._player.name }], this._player.id))
  }

  public receiveMessage(message: ChatMessage) {
    this._messages.push(message)
  }
}

interface ChatMessage {
  name: string,
  msg: string
}