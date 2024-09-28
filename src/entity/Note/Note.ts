import { FUser } from "../FUser.ts";
import { Collection } from "../Collection.ts";
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
    likeCount: number;
    viewCount: number;
    saveCount: number;
    replyCount: number;

    constructor(noteId: string, author: FUser, collection: Collection, noteUrl: string, uploadDate: string, title: string, replies: NoteReply[], tags: NoteTag[], likeCount: number, viewCount: number, saveCount: number, replyCount: number) {
        this.noteId = noteId;
        this.author = author;
        this.collection = collection;
        this.noteUrl = noteUrl;
        this.uploadDate = uploadDate;
        this.title = title;
        this.replies = replies;
        this.tags = tags;
        this.likeCount = likeCount;
        this.viewCount = viewCount;
        this.saveCount = saveCount;
        this.replyCount = replyCount
    }
}