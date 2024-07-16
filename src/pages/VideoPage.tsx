import { CloudUpload } from "@mui/icons-material";
import { Stack, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { VideoUploadDialog } from "../components/UtilComponents/VideoUploadDialog.tsx";
import axiosInstance from "../utils/AxiosInstance";
import { Video } from "../entity/Video";
import ResponseCodes from "../entity/ResponseCodes";
import { VideoCard } from "../components/Video/VideoCard";

export const VideoPage = () => {
    const [videoUploadDialogOpen, setVideoUploadDialogOpen] =
        useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    let totalPages: number;
    const [videos, setVideos] = useState<Video[]>([]);

    const getSuggestedVideos = async () => {
        axiosInstance
            .get("/video/get/order", {
                params: {
                    page: page,
                    size: 10,
                    orderBy: "likeCount",
                    ascending: false,
                },
            })
            .then((resp) => {
                if (resp.data.code == ResponseCodes.SUCCESS) {
                    setVideos(resp.data.data.content);
                    totalPages = resp.data.data.totalPages;
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

    useEffect(() => {
        getSuggestedVideos();
    }, [page]);

    return (
        <>
            {/* Header row */}
            <Stack direction="row" spacing={2} sx={{ mb: "2rem", ml: "2rem" }}>
                <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => {
                        setVideoUploadDialogOpen(true);
                    }}
                >
                    Video Upload
                </Button>
            </Stack>
            <Grid
                container
                spacing={{ xs: 2, md: 2 }}
                style={{
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                    maxWidth: "100%",
                }}
            >
                {videos.map((item, index) => (
                    <Grid item xs md={3} key={index}>
                        <VideoCard video={item} />
                    </Grid>
                ))}
            </Grid>

            {/* Dialogs */}
            <VideoUploadDialog
                videoUploadDialogOpen={videoUploadDialogOpen}
                setVideoUploadDialogOpen={setVideoUploadDialogOpen}
            />
        </>
    );
};
