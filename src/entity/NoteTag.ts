/** java
 *     @Id
 *     @GeneratedValue(strategy = GenerationType.AUTO)
 *     public Long noteTagId;
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "note_id")
 *     public Note note;// fk
 *     public String tagText;
 */
import {Note} from "./Note.ts";

export class NoteTag {
    noteTagId: number;
    note: Note;
    tagText: string;

    constructor(noteTagId: number, note: Note, tagText: string) {
        this.noteTagId = noteTagId;
        this.note = note;
        this.tagText = tagText;
    }
}