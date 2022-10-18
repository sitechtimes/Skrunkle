export enum PacketType{
    update = "Update",
    info = "Info",
    movement = "Movement"
}

export class Packet{

    public type: String;
    public payload: any; 

    constructor(packetType: PacketType, data: Array<any>){
        this.type = packetType;
        this.payload = data;
    }

}