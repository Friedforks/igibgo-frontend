import { FUser } from "./FUser";
import { NoteBookmark } from "./Note/NoteBookmark.ts";
import { VideoBookmark } from "./Video/VideoBookmark.ts";

export class Bookmark{
    bookmarkId: number;
    user:FUser;
    noteBookmarks:NoteBookmark[];
    videoBookmarks:VideoBookmark[];
    bookmarkName:string;
    // constructor
    constructor(bookmarkId:number, user:FUser, noteBookmarks:NoteBookmark[], videoBookmarks:VideoBookmark[], bookmarkName:string){
        this.bookmarkId = bookmarkId;
        this.user = user;
        this.noteBookmarks = noteBookmarks;
        this.videoBookmarks = videoBookmarks;
        this.bookmarkName = bookmarkName;
    }
}