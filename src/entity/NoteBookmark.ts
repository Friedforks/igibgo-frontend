import { Bookmark } from "./Bookmark";
import { Video } from "./Note";

export class NoteBookmark {
    noteBookmarkId: string;
    bookmark: Bookmark;
    note: Video;
    // constructor
    constructor(noteBookmarkId: string, bookmark: Bookmark, note: Video) {
        this.noteBookmarkId = noteBookmarkId;
        this.bookmark = bookmark;
        this.note = note;
    }
}