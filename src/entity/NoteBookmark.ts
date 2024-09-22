import { Bookmark } from "./Bookmark";
import { Note } from "./Note";

export class NoteBookmark {
    noteBookmarkId: string;
    bookmark: Bookmark;
    note: Note;
    // constructor
    constructor(noteBookmarkId: string, bookmark: Bookmark, note: Note) {
        this.noteBookmarkId = noteBookmarkId;
        this.bookmark = bookmark;
        this.note = note;
    }
}