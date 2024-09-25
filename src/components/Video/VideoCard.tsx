import {
    Avatar,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Stack,
    Typography,
} from "@mui/material";
import { Video } from "../../entity/Video.ts";
import { useNavigate } from "react-router-dom";

// later to pass prop. Now only placeholder so no need.
type VideoCardProps = {
    video: Video;
};

export const VideoCard = ({ video }: VideoCardProps) => {
    const navigate = useNavigate();
    const handleVideoCardClick = () => {
        navigate(`/video/open/${video.videoId}`);
    };
    return (
        <>
            <Card sx={{ width: "100%", maxWidth: "20rem" }}>
                <CardActionArea onClick={handleVideoCardClick}>
                    <CardMedia
                        component="img"
                        sx={{ height: "10rem" }}
                        image={video.videoCoverUrl}
                        alt="video cover"
                    />
                    <CardContent>
                        <Stack direction="row" spacing={2}>
                            <Avatar src={video.author.avatarUrl}></Avatar>
                            <div>
                                <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    component="div"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        WebkitLineClamp: 2,
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {video.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {video.author.username}
                                </Typography>
                            </div>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    );
};
