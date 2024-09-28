import {
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Stack,
    Divider,
    Typography,
    Chip,
    IconButton,
} from "@mui/material";
import { Note } from "../../entity/Note/Note.ts";
import {
    VisibilityOutlined,
    ThumbUpAltOutlined,
    Delete,
} from "@mui/icons-material";
import { FUser } from "../../entity/FUser";
import axiosInstance from "../../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";

type NoteListProps = {
    noteList: Note[];
    handleNoteListItemClick: (noteId: string) => void;
};

export const NoteList = ({
    noteList,
    handleNoteListItemClick,
}: NoteListProps) => {
    const userInfo = JSON.parse(
        localStorage.getItem("userInfo") as string
    ) as FUser;

    const handleDeleteNote = (noteId: string) => {
        axiosInstance
            .delete("/note/delete", {
                params: {
                    token: localStorage.getItem("token"),
                    noteId: noteId,
                },
            })
            .then((response: AxiosResponse<APIResponse<void>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    sweetAlert(
                        "Success",
                        "Note deleted successfully",
                        "success"
                    ).then(() => {
                        window.location.reload();
                    });
                } else {
                    sweetAlert("Error", response.data.message, "error");
                }
            })
            .catch((error) => {
                console.log("Error in deleting note", error);
            });
    };
    return (
        <>
            {noteList.length != 0 ? (
                <List sx={{ width: "100%" }}>
                    {noteList.map((value: Note) => (
                        <>
                            <ListItem
                                key={value.noteId}
                                alignItems="center"
                                disablePadding
                            >
                                <ListItemButton
                                    onClick={() =>
                                        handleNoteListItemClick(value.noteId)
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt="user avatar"
                                            src={value.author.avatarUrl}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={value.title}
                                        secondary={
                                            <Stack
                                                direction="row"
                                                divider={
                                                    <Divider
                                                        orientation="vertical"
                                                        flexItem
                                                    />
                                                }
                                                spacing={1}
                                            >
                                                <>
                                                    <VisibilityOutlined
                                                        fontSize="small"
                                                        sx={{
                                                            marginRight: "3px",
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            marginRight: "20px",
                                                        }}
                                                    >
                                                        {value.viewCount}
                                                    </Typography>
                                                </>
                                                <>
                                                    <ThumbUpAltOutlined
                                                        fontSize="small"
                                                        sx={{
                                                            marginRight: "3px",
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {value.likeCount}
                                                    </Typography>
                                                </>
                                            </Stack>
                                        }
                                    />
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        useFlexGap
                                        justifyContent="flex-end"
                                    >
                                        {value.tags.map((tag) => (
                                            <Chip
                                                label={tag.tagText}
                                                key={tag.noteTagId}
                                            ></Chip>
                                        ))}
                                    </Stack>
                                </ListItemButton>
                                {value.author.userId == userInfo.userId && (
                                    <IconButton
                                        children={<Delete />}
                                        onClick={() => {
                                            handleDeleteNote(value.noteId);
                                        }}
                                    />
                                )}
                            </ListItem>
                            {/* <Divider component="li" /> */}
                        </>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" sx={{ margin: "1rem" }}>
                    No notes
                </Typography>
            )}
        </>
    );
};
