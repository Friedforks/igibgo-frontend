import {
    ArrowBackIos,
    ArrowForwardIos,
    CloudUpload,
    Search,
} from "@mui/icons-material";
import {
    Stack,
    Button,
    Grid,
    TextField,
    IconButton,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { VideoUploadDialog } from "../components/UtilComponents/VideoUploadDialog.tsx";
import axiosInstance from "../utils/AxiosInstance";
import { Video } from "../entity/Video/Video.ts";
import ResponseCodes from "../entity/UtilEntity/ResponseCodes.ts";
import { Page } from "../entity/UtilEntity/Page.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import { useNavigate, useParams } from "react-router-dom";
import { VideoGrid } from "../components/Video/VideoGrid.tsx";

export const VideoPage = () => {
    const [videoUploadDialogOpen, setVideoUploadDialogOpen] =
        useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    // videos is a list of videos so that it can be appended to the existing list
    const [videos, setVideos] = useState<Video[]>([]);
    // videosPaged is a paged list of videos so that it can be used to get the next page
    const params = useParams();
    // video query title is the title of the video that is being searched for
    const videoQueryTitle = params.title;
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();
    const pageSize = 10;

    const getSuggestedVideos = async () => {
        axiosInstance
            .get("/video/get/order", {
                params: {
                    page: page,
                    size: pageSize,
                    orderBy: "likeCount",
                    ascending: false,
                },
            })
            .then((resp: AxiosResponse<APIResponse<Page<Video[]>>>) => {
                if (resp.data.code == ResponseCodes.SUCCESS) {
                    setVideos(resp.data.data.content);
                    setTotalPages(resp.data.data.totalPages);
                    console.log(resp);
                } else {
                    console.log(
                        "Error in get suggested videos request: " +
                            resp.data.message
                    );
                }
            })
            .catch((error) => {
                console.log("Error in get suggested videos request: " + error);
            });
    };

    const getVideosByTitle = async () => {
        axiosInstance
            .get("/video/get/title", {
                params: {
                    videoTitle: videoQueryTitle,
                    page: page,
                    size: pageSize,
                },
            })
            .then((resp: AxiosResponse<APIResponse<Page<Video[]>>>) => {
                if (resp.data.code == ResponseCodes.SUCCESS) {
                    setVideos(resp.data.data.content);
                    setTotalPages(resp.data.data.totalPages);
                    console.log(resp);
                } else {
                    console.log(
                        "Error in get videos by title request: " +
                            resp.data.message
                    );
                }
            })
            .catch((error) => {
                console.log("Error in get videos by title request: " + error);
            });
    };

    const submitVideoTitleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // access the form data
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        setPage(0);
        navigate(`/video/search/${title}`);
        location.reload();
    };

    useEffect(() => {
        if (videoQueryTitle) {
            getVideosByTitle();
        } else {
            getSuggestedVideos();
        }
    }, [page]);

    return (
        <>
            <div style={{ height: "80vh", overflowY: "auto" }}>
                {/* Header row */}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mb: "2rem", ml: "2rem" }}
                >
                    <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        onClick={() => {
                            setVideoUploadDialogOpen(true);
                        }}
                    >
                        Video Upload
                    </Button>
                    {/* Search bar */}
                    <form
                        style={{ width: "40%" }}
                        onSubmit={submitVideoTitleSearch}
                    >
                        <TextField
                            name="title"
                            placeholder="Click here to search"
                            InputProps={{
                                endAdornment: (
                                    <IconButton type="submit">
                                        <Search />
                                    </IconButton>
                                ),
                            }}
                            fullWidth
                        />
                    </form>
                </Stack>
                {/* flip page button */}
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                >
                    <Grid item>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => {
                                page > 0 ? setPage(page - 1) : setPage(0);
                            }}
                            disabled={page == 0}
                        >
                            <ArrowBackIos fontSize="inherit" />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography>{page + 1}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => {
                                setPage(page + 1);
                            }}
                            disabled={page == totalPages - 1}
                        >
                            <ArrowForwardIos fontSize="inherit" />
                        </IconButton>
                    </Grid>
                </Grid>
                <VideoGrid videos={videos} />

                {/* Dialogs */}
                <VideoUploadDialog
                    videoUploadDialogOpen={videoUploadDialogOpen}
                    setVideoUploadDialogOpen={setVideoUploadDialogOpen}
                />
            </div>
        </>
    );
};
