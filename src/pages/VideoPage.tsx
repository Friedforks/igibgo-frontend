import {CloudUpload} from "@mui/icons-material";
import {Stack, Button, Grid} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {VideoUploadDialog} from "../components/UtilComponents/VideoUploadDialog.tsx";
import axiosInstance from "../utils/AxiosInstance";
import {Video} from "../entity/Video";
import ResponseCodes from "../entity/ResponseCodes";
import {VideoCard} from "../components/Video/VideoCard";
import {Page} from "../entity/Page.ts";
import {Axios, AxiosResponse} from "axios";
import APIResponse from "../entity/APIResponse.ts";

export const VideoPage = () => {
    const [videoUploadDialogOpen, setVideoUploadDialogOpen] =
        useState<boolean>(false);

    const [page, setPage] = useState<number>(0);
    // videos is a list of videos so that it can be appended to the existing list
    const [videos, setVideos] = useState<Video[]>([]);
    // videosPaged is a paged list of videos so that it can be used to get the next page
    const [videosPaged, setVideosPaged] = useState<Page<Video[]>>();

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
            .then((resp: AxiosResponse<APIResponse<Page<Video[]>>>) => {
                if (resp.data.code == ResponseCodes.SUCCESS) {
                    setVideosPaged(resp.data.data);
                    setVideos([...videos, ...resp.data.data.content]);
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

    useEffect(() => {
        getSuggestedVideos();
    }, [page]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        // Function to handle scroll event
        const handleScroll = () => {
            if(!containerRef.current) return;
            // console.log("scrollTop+clientHeight: ", containerRef.current.scrollTop + containerRef.current.clientHeight);
            // console.log("scrollHeight: ", containerRef.current.scrollHeight);
            if (containerRef.current) {
                const {scrollTop, scrollHeight, clientHeight} = containerRef.current;
                // If the user has scrolled to the bottom of the container
                if (scrollTop + clientHeight >= scrollHeight && !videosPaged?.last) {
                    setPage(page + 1);
                }
            }
        };

        // Add scroll event listener to the container
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    return (
        <>
            <div ref={containerRef} style={{ height: '80vh', overflowY: 'auto' }} >
                {/* Header row */}
                <Stack direction="row" spacing={2} sx={{mb: "2rem", ml: "2rem"}}>
                    <Button
                        variant="contained"
                        startIcon={<CloudUpload/>}
                        onClick={() => {
                            setVideoUploadDialogOpen(true);
                        }}
                    >
                        Video Upload
                    </Button>
                </Stack>
                <Grid
                    container
                    spacing={{xs: 2, md: 2}}
                    style={{
                        paddingLeft: "2rem",
                        paddingRight: "2rem",
                        maxWidth: "100%",
                    }}
                >
                    {videos.map((item, index) => (
                        <Grid item xs md={3} key={index}>
                            <VideoCard video={item}/>
                        </Grid>
                    ))}
                </Grid>

                {/* Dialogs */}
                <VideoUploadDialog
                    videoUploadDialogOpen={videoUploadDialogOpen}
                    setVideoUploadDialogOpen={setVideoUploadDialogOpen}
                />
            </div>
        </>
    );
};
