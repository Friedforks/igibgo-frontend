import { Bookmark } from "../Bookmark.ts";
import { Video } from "./Video.ts";

export class VideoBookmark {
    videoBookmarkId: string;
    bookmark: Bookmark;
    video: Video;
    // constructor
    constructor(videoBookmarkId: string, bookmark: Bookmark, video: Video) {
        this.videoBookmarkId = videoBookmarkId;
        this.bookmark = bookmark;
        this.video = video;
    }
}