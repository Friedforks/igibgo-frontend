import { TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/APIResponse";
import { Bookmark } from "../../entity/Bookmark";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Typography,
} from "@mui/material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { NoteBookmark } from "../../entity/NoteBookmark";
import { useNavigate } from "react-router-dom";
import { Note } from "../../entity/Note";
import { NoteList } from "../Note/NoteList";
import { VideoGrid } from "../Video/VideoGrid";
import { Video } from "../../entity/Video";
import { VideoBookmark } from "../../entity/VideoBookmark";

type UserBookmarkTabProps = {
    userId: number;
};
export const UserBookmarkTab = ({ userId }: UserBookmarkTabProps) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [noteList, setNoteList] = useState<Note[][]>([[]]);
    const [videoList, setVideoList] = useState<Video[][]>([[]]);
    useEffect(() => {
        getBookmarks();
    }, []);

    const getBookmarks = () => {
        axiosInstance
            .get("/bookmark/get/by/userId", {
                params: {
                    userId: userId,
                },
            })
            .then((response: AxiosResponse<APIResponse<Bookmark[]>>) => {
                setBookmarks(response.data.data);
                const respData = response.data.data;
                // decompose bookmark list's note field into a list of notes (to be used in the NoteList component)
                const extractedNotes = respData.map((item) =>
                    item.noteBookmarks.map(
                        (noteBookmark: NoteBookmark) => noteBookmark.note
                    )
                );
                const extractedVideos = respData.map((item) =>
                    item.videoBookmarks.map(
                        (videoBookmark: VideoBookmark) => videoBookmark.video
                    )
                );
                setNoteList(extractedNotes);
                setVideoList(extractedVideos);
                console.log("debug: extractedNotes", extractedNotes);
                console.log("debug: extractedVideos", extractedVideos);
            });
    };
    const navigate = useNavigate();
    const handleNoteListItemClick = (noteId: string) => {
        navigate(`/note/open/${noteId}`);
    };
    return (
        <TabPanel id="4" value="4" sx={{ padding: 0 }}>
            {bookmarks ? (
                <div>
                    {bookmarks.map((bookmark: Bookmark, index: number) => (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreOutlined />}
                                id={bookmark.bookmarkId.toString()}
                            >
                                <Typography variant="h6">
                                    {bookmark.bookmarkName}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: 0 }}>
                                <Divider />
                                <Typography
                                    variant="subtitle1"
                                    sx={{ margin: "1rem", mb: "0" }}
                                >
                                    Notes:
                                </Typography>
                                {noteList[index].length != 0 ? (
                                    <NoteList
                                        noteList={noteList[index]}
                                        handleNoteListItemClick={
                                            handleNoteListItemClick
                                        }
                                    />
                                ) : (
                                    <Typography
                                        variant="body1"
                                        sx={{ margin: "1rem" }}
                                    >
                                        No notes
                                    </Typography>
                                )}
                                <Typography
                                    variant="subtitle1"
                                    sx={{ margin: "1rem" }}
                                >
                                    Videos:
                                </Typography>
                                {videoList[index].length != 0 ? (
                                    <VideoGrid videos={videoList[index]} />
                                ) : (
                                    <Typography
                                        variant="body1"
                                        sx={{ margin: "1rem" }}
                                    >
                                        No videos
                                    </Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            ) : (
                <Typography variant="h6">No bookmarks</Typography>
            )}
        </TabPanel>
    );
};
