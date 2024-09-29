import {Post} from "./Post.ts";
import {FUser} from "../FUser.ts";

export class PostReply{
    postReplyId:number;
    post:Post;
    parentReply:PostReply;
    childReplyCount:number;
    replyContent:string;
    likeCount:number;
    replyDate:Date;
    user:FUser;

    constructor(postReplyId: number, post: Post, parentReply: PostReply, childReplyCount: number, replyContent: string, likeCount: number, replyDate: Date, user: FUser) {
        this.postReplyId = postReplyId;
        this.post = post;
        this.parentReply = parentReply;
        this.childReplyCount = childReplyCount;
        this.replyContent = replyContent;
        this.likeCount = likeCount;
        this.replyDate = replyDate;
        this.user = user;
    }
}