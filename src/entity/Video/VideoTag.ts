import {Video} from "./Video.ts";

/** java
 *     @Id
 *     @GeneratedValue(strategy = GenerationType.IDENTITY)
 *     public Long videoTagId;
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "video_id")
 *     public Video video;
 *     public String tagText;
 */
export class VideoTag {
    videoTagId: number;
    video: Video;
    tagText: string;

    constructor(videoTagId: number, video: Video, tagText: string) {
        this.videoTagId = videoTagId;
        this.video = video;
        this.tagText = tagText;
    }
}