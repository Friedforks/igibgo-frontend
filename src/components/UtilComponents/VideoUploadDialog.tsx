import { AddOutlined, CloudUpload } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button,
    Typography,
    TextField,
    DialogActions,
    ImageList,
    ImageListItem,
    InputLabel,
    MenuItem,
    Select,
    CircularProgress,
    Stack,
} from "@mui/material";
import { LineProgressBuffer } from "../Upload/LineProgressBuffer.tsx";
import { useEffect, useRef, useState } from "react";
import { CustomBackdrop } from "./CustomBackdrop.tsx";
import { CollectionDialog } from "../Video/CollectionDialog.tsx";
import { Collection } from "../../entity/Collection.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import { FUser } from "../../entity/FUser.ts";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";
import axiosInstance from "../../utils/AxiosInstance.ts";
import { checkLoginStatus } from "../../utils/LoginUtil.ts";

type VideoUploadDialogProps = {
    videoUploadDialogOpen: boolean;
    setVideoUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export const VideoUploadDialog = ({
    videoUploadDialogOpen,
    setVideoUploadDialogOpen,
}: VideoUploadDialogProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [videoFile, setVideoFile] = useState<File>();
    const [progress, setProgress] = useState(0);
    const [buffer, setBuffer] = useState(10);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    const [blobs, setBlobs] = useState<Blob[]>([]);

    const [videoCoverGenerating, setVideoCoverGenerating] = useState(false);

    const handleVideoUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setVideoCoverGenerating(true);
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.onloadeddata = async () => {
                    await captureFrames(); // start capturing frames
                    setVideoCoverGenerating(false);
                };
            }
        }
    };

    const captureFrames = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext("2d");
            if (!context) return;

            const duration = video.duration;
            // capture frames at 0%, 20%, 40%, 60%, 80%, and 100% of the video duration
            const timePoints = [0, 0.2, 0.4, 0.6, 0.8, 1].map(
                (p) => p * duration
            );
            // save the blobs and image URLs for the captured frames
            const blobs: Blob[] = [];
            const imageUrls: string[] = [];

            // capture frames at the specified time points
            for (const timePoint of timePoints) {
                video.currentTime = timePoint;
                await new Promise<void>((resolve) => {
                    video.onseeked = () => {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(
                            video,
                            0,
                            0,
                            video.videoWidth,
                            video.videoHeight
                        );
                        canvas.toBlob((blob: Blob | null) => {
                            if (blob) {
                                blobs.push(blob);
                                imageUrls.push(URL.createObjectURL(blob));
                            }
                            resolve();
                        }, "image/jpeg");
                    };
                });
            }

            setBlobs(blobs);
            setImageURLs(imageUrls);
        }
    };

    const [snapshotChoice, setSnapshotChoice] = useState<number>(0);
    const [addCollectionDialogOpen, setAddCollectionDialogOpen] =
        useState<boolean>(false);

    const [collectionValue, setCollectionValue] = useState<string>("");

    const [availableCollections, setAvailableCollections] = useState<
        Collection[]
    >([]);
    const getCollections = async () => {
        if ((await checkLoginStatus()) == false) {
            sweetAlert("Error", "Please login first", "error").then(() => {
                window.location.reload();
            });
        }
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const userId = (JSON.parse(userInfo) as FUser).userId;
            axiosInstance
                .get("/collection/get/userId", {
                    params: {
                        userId: userId,
                    },
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
    const [collectionListUpdateFlag, setCollectionListUpdateFlag] =
        useState<boolean>(false);
    useEffect(() => {
        getCollections();
    }, [collectionListUpdateFlag]);

    const [serverFileProcessing, setServerFileProcessing] = useState(false);
    const videoFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // check
        if (!videoFile) {
            // no video file
            sweetAlert("Error", "Video file is not selected", "error");
        }
        if (!blobs || blobs.length === 0) {
            // no snapshots
            sweetAlert(
                "Error",
                "Please wait until the video covers are automatically generated",
                "error"
            );
        } else if (
            // no title
            !formData.get("title") ||
            (formData.get("title") as string).trim() === ""
        ) {
            sweetAlert("Error", "Please enter a title", "error");
        } else if (
            // no tags
            !formData.get("tags") ||
            (formData.get("tags") as string).trim() === ""
        ) {
            sweetAlert(
                "Error",
                "Please enter at least one tag for the video to be better discovered",
                "error"
            );
        } else if (!collectionValue) {
            // no collection selected
            sweetAlert("Error", "Please select a collection", "error");
        } else if ((await checkLoginStatus()) == false) {
            sweetAlert("Error", "Please login first", "error").then(() => {
                window.location.reload();
            });
        } else {
            const data = new FormData();
            data.append("video", videoFile as File);
            data.append("videoCover", blobs[snapshotChoice] as Blob);
            data.append("title", formData.get("title") as string);
            data.append("tags", formData.get("tags") as string);
            data.append(
                "authorId",
                (
                    JSON.parse(
                        localStorage.getItem("userInfo") as string
                    ) as FUser
                ).userId.toString()
            );
            data.append("collectionId", collectionValue);
            setIsUploading(true);
            axiosInstance
                .post("/video/upload", data, {
                    onUploadProgress: (progressEvent) => {
                        const total = progressEvent.total || 1; // Avoid division by zero
                        const currentProgress = Math.round(
                            (progressEvent.loaded * 100) / total
                        );
                        setProgress(currentProgress);
                        setBuffer(
                            currentProgress + Math.round(10 * Math.random())
                        );
                        if (currentProgress >= 100) {
                            setServerFileProcessing(true);
                        }
                    },
                })
                .then((resp: AxiosResponse<APIResponse<null>>) => {
                    setIsUploading(false);
                    setServerFileProcessing(false);
                    if (resp.data.code == ResponseCodes.SUCCESS) {
                        setVideoUploadDialogOpen(false);
                        sweetAlert(
                            "Success",
                            "Video uploaded successfully",
                            "success"
                        ).then(() => {
                            window.location.reload();
                        });
                    } else {
                        sweetAlert("Error", resp.data.message, "error");
                    }
                })
                .catch((error) => {
                    sweetAlert("Error", "Error in uploading note: " + error, "error");
                });
        }
    };
    return (
        <>
            {/* Video upload dialog */}
            <Dialog
                open={videoUploadDialogOpen}
                onClose={() => {
                    setVideoUploadDialogOpen(false);
                    console.log("open");
                }}
                PaperProps={{
                    component: "form",
                    onSubmit: videoFormSubmit,
                }}
            >
                {isUploading && (
                    <LineProgressBuffer progress={progress} buffer={buffer} />
                )}

                <CustomBackdrop open={serverFileProcessing}>
                    <Stack direction="row" spacing={2}>
                        <CircularProgress color="inherit" />
                        <label>
                            Server processing the video file. Please wait...
                        </label>
                    </Stack>
                </CustomBackdrop>

                <CustomBackdrop open={videoCoverGenerating}>
                    <Stack direction="row" spacing={2}>
                        <CircularProgress color="inherit" />
                        <label>
                            Video cover is automatically generating. This
                            requires your device's GPU to compute. Please
                            wait...
                        </label>
                    </Stack>
                </CustomBackdrop>

                <DialogTitle>Upload your own video!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Study hive is a platform for sharing knowledge. You can
                        create and upload videos to share knowledge with others.
                        Please upload your video <b>in H264 format</b> here.
                        Please make sure that the content is easy for others to
                        understand. <br /> "If you can't explain something to a
                        first year student, then you haven't really understood."
                        -- Richard P. Feynman
                    </DialogContentText>
                    <label>
                        <Button
                            component="span"
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUpload />}
                        >
                            Upload Video (H264)
                        </Button>
                        <input
                            name="videoFile"
                            type="file"
                            hidden
                            style={{ display: "none" }}
                            onChange={handleVideoUpload}
                        />
                        <Typography
                            variant="caption"
                            style={{ marginLeft: "5px" }}
                        >
                            {videoFile && videoFile.name}
                        </Typography>
                    </label>
                    <video ref={videoRef} style={{ display: "none" }} />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <ImageList cols={2} rowHeight={"auto"}>
                        {imageURLs.map((url, index) => (
                            <ImageListItem key={index}>
                                <img
                                    onClick={() => {
                                        setSnapshotChoice(index);
                                    }}
                                    src={url}
                                    alt={"frame" + index}
                                    loading="lazy"
                                    style={{
                                        borderRadius: 5,
                                        borderStyle:
                                            snapshotChoice === index
                                                ? "solid"
                                                : "none",
                                        borderColor: "#1976d2",
                                    }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="title"
                        label="Video Title:"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="tags"
                        label="Tags (separate with comma):"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <label>
                        <InputLabel id="demo-multiple-chip-label">
                            Collection:
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
                                <MenuItem value={collection.collectionId} key={collection.collectionId}>
                                    {collection.collectionName}
                                </MenuItem>
                            ))}
                        </Select>
                    </label>
                    <Button
                        variant="outlined"
                        startIcon={<AddOutlined />}
                        sx={{ marginTop: "10px" }}
                        onClick={() => {
                            setAddCollectionDialogOpen(true);
                        }}
                    >
                        Add collection
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setVideoUploadDialogOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </Dialog>

            <CollectionDialog
                addCollectionDialogOpen={addCollectionDialogOpen}
                setAddCollectionDialogOpen={setAddCollectionDialogOpen}
                collectionListUpdateFlag={collectionListUpdateFlag}
                setCollectionListUpdateFlag={setCollectionListUpdateFlag}
            />
        </>
    );
};
