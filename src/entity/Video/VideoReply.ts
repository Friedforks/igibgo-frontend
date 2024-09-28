import {Video} from "./Video.ts";
import {FUser} from "../FUser.ts";

/** java
 *     @Id
 *     @GeneratedValue(strategy = GenerationType.IDENTITY)
 *     public Long videoReplyId;
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "video_id")
 *     public Video video;
 *     public String replyContent;
 *     public LocalDateTime replyDate = LocalDateTime.now(ZoneId.of("Asia/Shanghai"));
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "author")
 *     public FUser author;
 */
export class VideoReply{
    videoReplyId: number;
    video: Video;
    replyContent: string;
    replyDate: Date;
    author:FUser

    constructor(videoReplyId: number, video: Video, replyContent: string, replyDate: Date, author: FUser) {
        this.videoReplyId = videoReplyId;
        this.video = video;
        this.replyContent = replyContent;
        this.replyDate = replyDate;
        this.author = author;
    }
}