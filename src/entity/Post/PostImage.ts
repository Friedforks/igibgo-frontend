import { FUser } from "../FUser.ts";

export class PostImage{
    postImageId:string;
    author:FUser;
    imageUrl:string;

    constructor(postImageId:string,author:FUser,imageUrl:string){
        this.postImageId=postImageId;
        this.author=author;
        this.imageUrl=imageUrl;
    }
}