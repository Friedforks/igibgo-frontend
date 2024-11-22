import { AddOutlined, CloudUpload } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputLabel,
    MenuItem,
    Select, Stack,
    TextField,
    Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import sweetAlert from "sweetalert";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";
import { FUser } from "../../entity/FUser";
import { Collection } from "../../entity/Collection";
import { AxiosResponse } from "axios";
import { LineProgressBuffer } from "../Upload/LineProgressBuffer.tsx";
import { checkLoginStatus } from "../../utils/LoginUtil.ts";
import { TagAutocomplete } from "../UtilComponents/TagAutocomplete.tsx";
import { Constants, Tag } from "../../utils/Constants.ts";

type NoteUploadDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NoteUploadDialog: React.FC<NoteUploadDialogProps> = ({
                                                                      open,
                                                                      setOpen
                                                                  }) => {
    const [collectionValue, setCollectionValue] = useState<string>("");
    const [availableCollections, setAvailableCollections] = useState<
        Collection[]
    >([]);
    const [addCollectionDialogOpen, setAddCollectionDialogOpen] =
        useState(false);
    const [isUploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [buffer, setBuffer] = useState(10);
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<(string)[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const getCollections = async () => {
        // get collections
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const userId = (JSON.parse(userInfo) as FUser).userId;
            axiosInstance
                .get("/collection/get/userId", {
                    params: {
                        userId: userId
                    }
                })
                .then((response: AxiosResponse<APIResponse<Collection[]>>) => {
                    if (response.data.code == ResponseCodes.SUCCESS) {
                        setAvailableCollections(response.data.data);
                    } else {
                        sweetAlert("Error", response.data.message, "error");
                    }
                });
        }
    };

    // tags
    const getTags = async () => {
        axiosInstance
            .get("/note/get/allTags")
            .then((response: AxiosResponse<APIResponse<string[]>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    // encapsulate response data (available tags) + fixed tags -> suggested tags
                    const tmpTags: Tag[] = Constants.fixedTags.map((tag) => ({
                        label: tag,
                        fixed: true
                    })).concat(response.data.data.map((tag) => ({ label: tag.trim(), fixed: false })));
                    // Remove duplicates
                    const uniqueTags = Array.from(new Set(tmpTags.map(tag => tag.label))).map(label => tmpTags.find(tag => tag.label === label)!);
                    setSuggestedTags(uniqueTags);
                } else {
                    sweetAlert("Error", response.data.message, "error");
                }
            });
    };

    const handleChange = (_event: React.SyntheticEvent, newValue: (string | Tag)[]) => {
        setSelectedTags(newValue.map((item) => typeof item === "string" ? item : item.label));
    };

    const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
        setInputValue(newInputValue);
    };

    useEffect(() => {
        getCollections();
        getTags();
    }, []);

    const addCollectionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const collectionName = formData.get("collectionName") as string;
        const userInfo = localStorage.getItem("userInfo");
        if (collectionName.trim() === "") {
            sweetAlert("Error", "Collection name cannot be empty", "error");
        }
        if (userInfo) {
            axiosInstance
                .post("/collection/add", 0, {
                    params: {
                        collectionName: collectionName,
                        userId: (JSON.parse(userInfo) as FUser).userId
                    }
                })
                .then((resp: AxiosResponse<APIResponse<null>>) => {
                    if (resp.data.code == ResponseCodes.SUCCESS) {
                        sweetAlert(
                            "Success",
                            "Collection added successfully",
                            "success"
                        );
                        setAddCollectionDialogOpen(false); // close the dialog
                        // update the availableCollections
                        getCollections();
                    } else {
                        sweetAlert("Error", resp.data.message, "error");
                    }
                });
        } else {
            sweetAlert("Error", "Please refresh the page", "error");
        }
    };

    const noteUploadSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const noteFile = formData.get("noteFile") as File;
        const title = formData.get("title") as string;
        const userInfo = JSON.parse(
            localStorage.getItem("userInfo") as string
        ) as FUser;
        if (userInfo == null) {
            sweetAlert("Error", "Please login first", "error");
            return;
        }
        if (noteFile == null) {
            sweetAlert("Error", "Please select a file to upload", "error");
            return;
        }
        const collectionId = collectionValue;
        const data = new FormData();
        if (title == null || title == "") {
            sweetAlert("Error", "Please enter title", "error");
            return;
        }
        if (selectedTags.length===0) {
            sweetAlert("Error", "Please enter tags", "error");
            return;
        }
        if (collectionId == null || collectionId == "") {
            sweetAlert("Error", "Please select a collection. A collection is a folder that you'll categorize the note into. It makes your notes to become more organized.", "error");
            return;
        }
        if ((await checkLoginStatus()) == false) {
            sweetAlert(
                "Error",
                "Please login first. You can refresh the page to do so.",
                "error"
            );
        }

        // make tags list into string, split by comma
        const tags=selectedTags.join(",");

        data.append("note", noteFile);
        data.append("authorId", userInfo.userId.toString());
        data.append("collectionId", collectionId);
        data.append("title", title);
        data.append("tags", tags);

        console.log("collectionId" + collectionId);
        setUploading(true);
        axiosInstance
            .post("/note/upload", data, {
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total || 1; // Avoid division by zero
                    const currentProgress = Math.round(
                        (progressEvent.loaded * 100) / total
                    );
                    setProgress(currentProgress);
                    setBuffer(currentProgress + Math.round(10 * Math.random()));
                }
            })
            .then((resp: AxiosResponse<APIResponse<null>>) => {
                setUploading(false);
                if (resp.data.code == ResponseCodes.SUCCESS) {
                    // setOpen(false);
                    sweetAlert(
                        "Success",
                        "Note uploaded successfully",
                        "success"
                    ).then(() => {
                        window.location.reload();
                    });
                } else {
                    sweetAlert("Error", resp.data.message, "error");
                }
            })
            .catch((error) => {
                sweetAlert(
                    "Error",
                    "Error in uploading note: " + error,
                    "error"
                );
                setUploading(false);
            });
    };

    const [file, setFile] = useState<File>();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null; // Safely access files array
        if (file) {
            setFile(file);
        }
    };

    return (
        <>
            {/* Note upload dialog */}
                <Dialog
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        console.log("open");
                    }}
                    PaperProps={{
                        component: "form",
                        onSubmit: noteUploadSubmit
                    }}
                >
                    {isUploading && (
                        <LineProgressBuffer progress={progress} buffer={buffer} />
                    )}
                    <DialogTitle>Upload your own note!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Study hive is a platform for sharing knowledge.
                            <b>Every user </b>can share their notes with others.
                            Please upload your note <b>in .pdf format</b> here.
                        </DialogContentText>
                        <Stack direction="column" spacing={2}>
                            <label>
                                <Button
                                    component="span"
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUpload />}
                                >
                                    Upload Note (PDF)
                                </Button>
                                <input
                                    name="noteFile"
                                    type="file"
                                    hidden
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <Typography
                                    variant="caption"
                                    style={{ marginLeft: "5px" }}
                                >
                                    {file && file.name}
                                </Typography>
                            </label>
                            <TextField
                                autoFocus
                                required
                                name="title"
                                label="Note Title:"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            <TagAutocomplete suggestedTags={suggestedTags} selectedTags={selectedTags}
                                             inputValue={inputValue} handleChange={handleChange}
                                             handleInputChange={handleInputChange} />

                            {/*<TextField*/}
                            {/*    autoFocus*/}
                            {/*    required*/}
                            {/*    margin="dense"*/}
                            {/*    name="tags"*/}
                            {/*    label="Tags (separate with comma):"*/}
                            {/*    type="text"*/}
                            {/*    fullWidth*/}
                            {/*    variant="standard"*/}
                            {/*/>*/}
                            <label>
                                <InputLabel id="demo-multiple-chip-label" required>
                                    Collection (categorize your file)
                                </InputLabel>
                                <Select
                                    name="collection"
                                    value={collectionValue}
                                    fullWidth
                                    onChange={(event) => {
                                        setCollectionValue(
                                            event.target.value as string
                                        );
                                    }}
                                >
                                    {availableCollections.map((collection) => (
                                        <MenuItem value={collection.collectionId}>
                                            {collection.collectionName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </label>
                            <Button
                                variant="outlined"
                                startIcon={<AddOutlined />}
                                onClick={() => {
                                    setAddCollectionDialogOpen(true);
                                }}
                            >
                                Add collection
                            </Button>
                        </Stack>
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

            {/* Add collection dialog */}
            <Dialog
                open={addCollectionDialogOpen}
                onClose={() => {
                    setAddCollectionDialogOpen(false);
                }}
                PaperProps={{
                    component: "form",
                    onSubmit: addCollectionSubmit
                }}
            >
                <DialogTitle>Add a new collection</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can use collections to organize your notes into
                        series. Such as "IBDP CS notes"
                    </DialogContentText>
                    <TextField
                        required
                        margin="dense"
                        name="collectionName"
                        label="Collection name:"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setAddCollectionDialogOpen(false);
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
