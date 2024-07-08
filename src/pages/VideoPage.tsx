import {VideoCard} from "../components/Video/VideoCard.tsx";
import {Grid} from "@mui/material";
import CustomHeader from "../components/HomePage/CustomHeader.tsx";

export const VideoPage = () => {
    return (
        <>
            <Grid container
                  spacing={{xs: 2, md: 2}}
                  style={{paddingLeft: "2rem",paddingRight:"2rem",maxWidth:"100%"}}>
                {Array.from(Array(6)).map((_, index) => (
                    <Grid item xs  md={3} key={index}>
                        <VideoCard/>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}