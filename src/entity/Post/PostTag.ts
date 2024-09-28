import {Post} from "./Post.ts";

export class PostTag{
    postTagId:string;
    post:Post;
    tagText:string;

    constructor(postTagId:string,post:Post,tagText:string){
        this.postTagId=postTagId;
        this.post=post;
        this.tagText=tagText;
    }
}