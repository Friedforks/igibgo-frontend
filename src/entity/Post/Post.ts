import { FUser } from "../FUser.ts";
import { PostReply } from "./PostReply.ts";
import {PostTag} from "./PostTag.ts";

export class Post{
    postId:string;
    author:FUser;
    likeCount:number;
    viewCount:number;
    uploadDate:Date;
    postContent:string;
    postType:string;
    title:string;

    tags:PostTag[];
    postReplies:PostReply[];

    constructor(postId:string,author:FUser,likeCount:number,viewCount:number,uploadDate:Date,postContent:string,postType:string,title:string,tags:PostTag[],postReplies:PostReply[]){
        this.postId=postId;
        this.author=author;
        this.likeCount=likeCount;
        this.viewCount=viewCount;
        this.uploadDate=uploadDate;
        this.postContent=postContent;
        this.postType=postType;
        this.title=title;
        this.tags=tags;
        this.postReplies=postReplies;
    }
}