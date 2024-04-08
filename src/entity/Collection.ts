import {FUser} from "./FUser.ts";

export class Collection{
    collectionId: string;
    fUser:FUser;

    constructor(collectionId: string, fUser: FUser) {
        this.collectionId = collectionId;
        this.fUser = fUser;
    }
}