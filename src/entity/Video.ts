/**    java
 *     @Id
 *     @GeneratedValue(strategy = GenerationType.IDENTITY)
 *     public String videoId;
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "author")
 *     public FUser author;
 *     public Long likeCount = 0L;
 *     public Long viewCount = 0L;
 *     public Long saveCount = 0L;
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "collection_id")
 *     public Collection collection;
 *     public String videoUrl;
 *     public String videoCoverUrl;
 *     public LocalDateTime uploadDate = LocalDateTime.now(TimeZone.getTimeZone("Asia/Shanghai").toZoneId());
 *     public String title;
 *
 *     @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
 *     public List<VideoReply> replies= new ArrayList<>();
 *
 *     @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
 *     public List<VideoTag> tags = new ArrayList<>();
 */
import {FUser} from "./FUser.ts";
import {Collection} from "./Collection.ts";
import {VideoReply} from "./VideoReply.ts";
import {VideoTag} from "./VideoTag.ts";

export class Video {
    videoId: string;
    author: FUser;
    likeCount: number;
    viewCount: number;
    saveCount: number;
    collection: Collection;
    videoUrl: string;
    videoCoverUrl: string;
    uploadDate: Date;
    title: string;
    replies: VideoReply[];
    tags: VideoTag[];

    constructor(videoId: string, author: FUser, likeCount: number, viewCount: number, saveCount: number, collection: Collection, videoUrl: string, videoCoverUrl: string, uploadDate: Date, title: string, replies: VideoReply[], tags: VideoTag[]) {
        this.videoId = videoId;
        this.author = author;
        this.likeCount = likeCount;
        this.viewCount = viewCount;
        this.saveCount = saveCount;
        this.collection = collection;
        this.videoUrl = videoUrl;
        this.videoCoverUrl = videoCoverUrl;
        this.uploadDate = uploadDate;
        this.title = title;
        this.replies = replies;
        this.tags = tags;
    }
}