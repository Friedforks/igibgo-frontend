import {Post} from "./Post.ts";
import {FUser} from "../FUser.ts";

export class PostReply{
    postReplyId:string;
    post:Post;
    replyContent:string;
    author:FUser;

    constructor(postReplyId:string,post:Post,replyContent:string,author:FUser){
        this.postReplyId=postReplyId;
        this.post=post;
        this.replyContent=replyContent;
        this.author=author;
    }
}