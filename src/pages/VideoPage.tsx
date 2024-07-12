import { CloudUpload } from "@mui/icons-material";
import { Stack, Button, Grid } from "@mui/material";
import { useState } from "react";
import { VideoList } from "../components/Video/VideoList";
import { VideoUploadDialog } from "../components/Video/VideoUploadDialog";

export const VideoPage = () => {
    const [videoUploadDialogOpen, setVideoUploadDialogOpen] =
        useState<boolean>(false);
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
                    {" "}
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
                {Array.from(Array(6)).map((_, index) => (
                    <Grid item xs md={3} key={index}>
                        <VideoList />
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
