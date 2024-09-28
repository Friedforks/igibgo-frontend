import { Grid, Typography } from "@mui/material";
import { VideoCard } from "./VideoCard";
import { Video } from "../../entity/Video/Video.ts";

type VideoGridProps = {
    videos: Video[];
};

export const VideoGrid = ({ videos }: VideoGridProps) => {
    return (
        <>
            {videos.length != 0 ? (
                <Grid
                    container
                    spacing={{ xs: 2, md: 2 }}
                    style={{
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        maxWidth: "100%",
                    }}
                >
                    {videos.map((item, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2}
                            key={index}
                            zeroMinWidth
                        >
                            <VideoCard video={item} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" align="center">
                    No videos found
                </Typography>
            )}
        </>
    );
};
