/** java
 *     @Id
 *     @GeneratedValue(strategy = GenerationType.IDENTITY)
 *     public String noteId;
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "author")
 *     public FUser author;
 *     public Long likeCount = 0L;
 *     public Long saveCount = 0L;
 *     public Long viewCount = 0L;
 *
 *     @ManyToOne(fetch = FetchType.EAGER)
 *     @JoinColumn(name = "collection_id")
 *     public Collection collection;// fk
 *
 *     public String noteUrl;
 *     public LocalDateTime uploadDate = LocalDateTime.now(ZoneId.of("Asia/Shanghai"));
 *     public String title;
 *
 *     @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
 *     public List<NoteReply> replies = new ArrayList<>();
 *
 *     @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
 *     public List<NoteTag> tags = new ArrayList<>();
 */
import { FUser } from "./FUser.ts";
import { Collection } from "./Collection.ts";
import { NoteReply } from "./NoteReply.ts";
import { NoteTag } from "./NoteTag.ts";

export class Note {
    noteId: string;
    author: FUser;
    collection: Collection;
    noteUrl: string;
    uploadDate: string;
    title: string;
    replies: NoteReply[];
    tags: NoteTag[];

    constructor(noteId: string,
        author: FUser,
        collection: Collection,
        noteUrl: string,
        uploadDate: string,
        title: string,
        replies: NoteReply[],
        tags: NoteTag[]) {
        this.noteId = noteId;
        this.author = author;
        this.collection = collection;
        this.noteUrl = noteUrl;
        this.uploadDate = uploadDate;
        this.title = title;
        this.replies = replies;
        this.tags = tags;
    }
}