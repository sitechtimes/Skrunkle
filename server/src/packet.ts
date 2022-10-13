export enum PacketType{
    update = "Update",
    info = "Info",
}

export class Packet{

    public type: String;
    public payload: any; 

    constructor(packetType: PacketType, data: any){
        this.type = packetType;
        this.payload = data;
    }

}