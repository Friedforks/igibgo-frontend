import { FUser } from "./FUser";
import { Note } from "./Note";

export class NoteBookmark {
    bookmarkNoteId: string;
    note: Note;
    user: FUser;
    folder:string;

    constructor(bookmarkId: string, note: Note, user: FUser, folder:string) {
        this.bookmarkNoteId = bookmarkId;
        this.note = note;
        this.user = user;
        this.folder = folder;
    }
}