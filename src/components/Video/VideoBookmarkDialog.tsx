import { useEffect, useState } from "react";
import { Bookmark } from "../../entity/Bookmark.ts";
import { FUser } from "../../entity/FUser.ts";
import axiosInstance from "../../utils/AxiosInstance.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/APIResponse.ts";
import ResponseCodes from "../../entity/ResponseCodes.ts";
import {
    Button,
    Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup, InputAdornment,
    InputLabel,
    TextField
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { VideoBookmark } from "../../entity/VideoBookmark.ts";

type VideoBookmarkDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentVideoId: string;
    dataUpdateRequired: boolean;
    setDataUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
};
export const VideoBookmarkDialog = ({
                                        open,
                                        setOpen,
                                        currentVideoId,
                                        dataUpdateRequired,
                                        setDataUpdateRequired
                                    }: VideoBookmarkDialogProps) => {
    const [bookmarked, setBookmarked] = useState<VideoBookmark[]>([]);
    const [availableBookmarks, setAvailableBookmarks] = useState<Bookmark[]>(
        []
    );
    const [checkedStatus, setCheckedStatus] = useState<boolean[]>([]);
    const userInfo = JSON.parse(
        localStorage.getItem("userInfo") as string
    ) as FUser;
    const userId = userInfo.userId;

    const getBookmarked = async () => {
        axiosInstance
            .get("/video/bookmark/get", {
                params: {
                    videoId: currentVideoId,
                    userId: userId
                }
            })
            .then((response: AxiosResponse<APIResponse<VideoBookmark[]>>) => {
                setBookmarked(response.data.data);
            });
    };

    const getUserBookmarks = async () => {
        axiosInstance
            .get("/fuser/bookmark/get/userId", {
                params: {
                    userId: userId
                }
            })
            .then((response: AxiosResponse<APIResponse<Bookmark[]>>) => {
                setAvailableBookmarks(response.data.data);
            });
    };

    useEffect(() => {
        getUserBookmarks(); // the user's bookmarks already available
        getBookmarked(); // the user's already saved bookmarks for this video
    }, []);
    useEffect(() => {
        updateCheckedStatus();
    }, [bookmarked, availableBookmarks]);

    const updateCheckedStatus = () => {
        // const start = performance.now();
        // O(N^3)
        setCheckedStatus(
            availableBookmarks.map((bookmark) =>
                bookmark.videoBookmarks.some((videoBookmark) =>
                    bookmarked.some(
                        (bm) =>
                            bm.videoBookmarkId === videoBookmark.videoBookmarkId
                    )
                )
            )
        );

        // const end = performance.now();
        // console.log(
        // 	`Time consuming function setCheckedStatus execution time: ${
        // 		end - start
        // 	} ms`
        // );
    };

    const bookmarkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const extraFolder = formData.get("extraFolder") as string;

        const selectedFolders: string[] = availableBookmarks
            .filter((_, index) => checkedStatus[index])
            .map((bookmark) => bookmark.bookmarkName);
        const newFolders: string[] = extraFolder
            .split(",")
            .map((folder) => folder.trim());

        // join new folders with selected folders
        selectedFolders.push(...newFolders);

        axiosInstance
            .post("/video/bookmark/new", 0, {
                params: {
                    videoId: currentVideoId,
                    userId: userId,
                    folder: selectedFolders.join(",") // join all folders with comma
                }
            })
            .then((response: AxiosResponse<APIResponse<boolean>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    sweetAlert("Success", "Video added to bookmark", "success").then(() => {
                        window.location.reload();
                    });
                    setOpen(false); // close the dialog
                    setDataUpdateRequired(!dataUpdateRequired); // update short user info display
                } else {
                    // don't close the dialog
                    sweetAlert(
                        "Error",
                        "Error in bookmarking this video: " +
                        response.data.message,
                        "error"
                    );
                }
            })
            .catch((error) => {
                // don't close the dialog
                sweetAlert(
                    "Error",
                    "Error in bookmarking this video: " + error,
                    "error"
                );
            });
    };

    const handleCheckboxChange = (index: number) => {
        setCheckedStatus(
            checkedStatus.map((checked, i) =>
                i === index ? !checked : checked
            )
        );
        console.log("Check staus: " + checkedStatus);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                PaperProps={{
                    component: "form",
                    onSubmit: bookmarkSubmit
                }}
            >
                <DialogTitle>Bookmark this video</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {availableBookmarks.map((bookmark, index) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedStatus[index]}
                                        onChange={() => {
                                            handleCheckboxChange(index);
                                        }}
                                    />
                                }
                                key={bookmark.bookmarkId}
                                label={bookmark.bookmarkName}
                            />
                        ))}
                    </FormGroup>
                    <label>
                        <InputLabel id="demo-multiple-chip-label">
                            Others folders: (new folder will be created,
                            separate by comma ',')
                        </InputLabel>
                        <TextField
                            fullWidth
                            variant="standard"
                            name="extraFolder"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AddOutlined />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
