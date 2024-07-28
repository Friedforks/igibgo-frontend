/** java
 *     @Id
 *     @GeneratedValue(strategy = GenerationType.AUTO)
 *     public Long noteTagId;
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "note_id")
 *     public Note note;// fk
 *     public String tagText;
 */
import {Video} from "./Note.ts";

export class NoteTag {
    noteTagId: number;
    note: Video;
    tagText: string;

    constructor(noteTagId: number, note: Video, tagText: string) {
        this.noteTagId = noteTagId;
        this.note = note;
        this.tagText = tagText;
    }
}