import { MainPlayer } from "../entity/mainPlayer";
import { Packet, PacketType } from "../packet";
import { Socket } from "../socket";

export class Chat {
  private _socket: Socket;
  private _player: MainPlayer;
  private _chatWindow: HTMLDivElement;
  private _chatBox: HTMLInputElement;
  private _chatUl: HTMLUListElement;
  private _messages: ChatMessage[] = [];

  constructor(socket: Socket, player: MainPlayer) {
    this._socket = socket;
    this._player = player;
    this._chatWindow = <HTMLDivElement>document.getElementById("chat");
    this._chatBox = <HTMLInputElement>document.getElementById("chat-box");
    this._chatUl = <HTMLUListElement>document.getElementById("chat-ul");
    this.listen();
  }

  private listen() {
    onkeydown = (event) => {
      switch (event.code) {
        case "Slash":
          this.toggleChat();
          break;
        case "ShiftRight":
          this._chatWindow.classList.add("hidden");
          document.getElementById("renderCanvas")?.focus();
          break;
      }
    };
  }

  public toggleChat() {
    // you can alter the css with this if you want
    if (!this._chatWindow.classList.toggle("hidden")) {
      this._chatBox.focus();
    } else {
      document.getElementById("renderCanvas")?.focus();
    }
  }

  public sendMessage(msg: string) {
    console.log("Sensd message")
    this._socket.send(
      new Packet(
        PacketType.chat,
        [<ChatMessage>{ msg: msg, name: this._player.name }],
        this._player.id
      )
    );
  }

  public receiveMessage(message: ChatMessage) {
    this._messages.push(message);
    console.log(this._messages);
    this._chatUl.insertAdjacentHTML(
      "beforeend",
      `
      <li>${message.name} - ${message.msg}</li>
    `
    );
  }
}

interface ChatMessage {
  name: string;
  msg: string;
}
