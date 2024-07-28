import { FUser } from "./FUser";
import { NoteBookmark } from "./NoteBookmark";
import { VideoBookmark } from "./VideoBookmark.ts";

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