export enum PacketType{
    update = "Update",
    info = "Info",
    movement = "Movement",
    mesh = "Mesh",
    close = "Close",
    interaction = "Interaction",
    chat = "Chat"
}

export class Packet{

    public type: String;
    public payload: any; 
    public uid?: string | undefined

    constructor(packetType: PacketType, data: Array<any>){
        this.type = packetType;
        this.payload = data;
    }

}