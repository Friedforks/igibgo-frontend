import {FUser} from "./FUser.ts";

export class Collection{
    collectionId: string;
    fUser:FUser;
    collectionName:string


    // constructor
    constructor(collectionId: string, fUser: FUser, collectionName: string){
        this.collectionId = collectionId;
        this.fUser = fUser;
        this.collectionName = collectionName;
    }
}