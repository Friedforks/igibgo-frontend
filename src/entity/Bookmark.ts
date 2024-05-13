import { FUser } from "./FUser";
import { NoteBookmark } from "./NoteBookmark";

export class Bookmark{
    bookmarkId: number;
    user:FUser;
    noteBookmarks:NoteBookmark[];
    bookmarkName:string;
    // constructor 
    constructor(bookmarkId:number, user:FUser, noteBookmarks:NoteBookmark[], bookmarkName:string){
        this.bookmarkId = bookmarkId;
        this.user = user;
        this.noteBookmarks = noteBookmarks;
        this.bookmarkName = bookmarkName;
    }
}