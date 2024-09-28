/** java
 *     @Id
 *     @GeneratedValue(strategy = GenerationType.AUTO)
 *     public Long noteReplyId;
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "note_id")
 *     public Note note;
 *     public String replyContent;
 *     public LocalDateTime replyDate = LocalDateTime.now(ZoneId.of("Asia/Shanghai"));
 *
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "author")
 *     public FUser author;
 */
import {Note} from "./Note.ts";
import {FUser} from "../FUser.ts";

export class NoteReply{
    noteReplyId:number;
    note:Note;
    replyContent:string;
    replyDate:Date;
    author:FUser;

    constructor(noteReplyId: number, note: Note, replyContent: string, replyDate: Date, author: FUser) {
        this.noteReplyId = noteReplyId;
        this.note = note;
        this.replyContent = replyContent;
        this.replyDate = replyDate;
        this.author = author;
    }
}