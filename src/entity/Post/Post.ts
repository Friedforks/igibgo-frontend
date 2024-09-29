import {FUser} from "../FUser.ts";
import {PostTag} from "./PostTag.ts";

export class Post {
    postId:string;
    author:FUser;
    likeCount:number;
    viewCount:number;
    uploadDate:Date;
    postContent:string;
    title:string;
    tags:PostTag[];

    constructor(postId: string, author: FUser, likeCount: number, viewCount: number, uploadDate: Date, postContent: string, title: string, tags: PostTag[]) {
        this.postId = postId;
        this.author = author;
        this.likeCount = likeCount;
        this.viewCount = viewCount;
        this.uploadDate = uploadDate;
        this.postContent = postContent;
        this.title = title;
        this.tags = tags;
    }
}