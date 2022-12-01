export enum PacketType{
    update = "Update",
    info = "Info",
    movement = "Movement",
    close = "Close",
    interaction = "Interaction"
}

export class Packet{

    public type: String;
    public payload: any; 
    public uid?: string | undefined;

    constructor(packetType: PacketType, data: Array<any>, uid: string){
        this.type = packetType;
        this.payload = data;
        this.uid = uid;
    }

}